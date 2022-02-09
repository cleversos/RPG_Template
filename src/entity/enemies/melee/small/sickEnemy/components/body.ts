import {
  Body,
  Box,
  Circle,
  Contact,
  Fixture,
  RevoluteJoint,
  RevoluteJointDef,
  Vec2,
} from "planck-js";
import { enemies } from "../../../../../../helpers/vars";
import { PlanckPhaserAdapter } from "../../../../../../physic/planck-phaser-adapter";
import { playerInWorld } from "../../../../../player/player";
import { EnemyBody } from "../../../../body";
import { SickEnemy } from "../sick-enemy";
import { PlayerState } from "../../../../../player/components/machine/states/state";
import { PlayerMachine } from "../../../../../player/components/machine/machine";
import { PlayerBody } from "../../../../../player/components/body";
import { GameCore } from "../../../../../../core/game";
import { PlayerAvatar } from "../../../../../player/components/avatar";
import { EnemyMovement } from "../../../../movement";
import { FireballBody } from "../../../../../player/components/abilities/fire/entity/fireball/components/body";
import { PlayerMovement } from "../../../../../player/components/movement";

const adapter = PlanckPhaserAdapter;

export class SickEnemyBody extends EnemyBody {
  public body: Body;

  public chestFixture: Fixture;
  public feetFixture: Fixture;

  public isTouchingPlayer: boolean = false;

  public groundSensor: Body;

  public constructor(sickEnemy: SickEnemy) {
    super(sickEnemy);
  }

  start() {
    const sickEnemy = this.enemy;
    const scene = this.enemy.scene;
    const worldScale = adapter.planckPhysics.worldScale;

    const bodyRadius = enemies.sickEnemy.enemyRadius;
    this.body = adapter.createCircle(sickEnemy.x, sickEnemy.y, bodyRadius, {
      filterGroupIndex: -1,
    });

    this.feetFixture = this.body.getFixtureList();
    this.chestFixture = this.body.createFixture({
      shape: Box(
        bodyRadius * worldScale,
        bodyRadius * worldScale,
        Vec2(0, -bodyRadius * worldScale)
      ),
      friction: 1,
      filterGroupIndex: -1,
    });

    this.body.setMassData({
      I: 0,
      mass: 1,
      center: Vec2(),
    });

    this.groundSensor = adapter.createRectangle(
      this.enemy.x,
      this.enemy.y + 25,
      10,
      4
    );
    this.groundSensor.setGravityScale(0);
    this.groundSensor.getFixtureList().setSensor(true);

    const revoluteJointDef: RevoluteJointDef = {
      localAnchorA: Vec2(0, 25 * worldScale),
      localAnchorB: Vec2(0, 0),
      bodyA: this.body,
      bodyB: this.groundSensor,
      referenceAngle: 0,
      enableMotor: true,
      maxMotorTorque: 20,
      collideConnected: false,
    };

    adapter.world.createJoint(RevoluteJoint(revoluteJointDef));

    // this.sickEnemy.container.addAt(
    //   scene.add.rectangle(0, -25, 50, 50, 0xff0000),
    //   0
    // );

    const boydTagName = "sick-enemy-body";
    this.body.setUserData({ tag: boydTagName, parent: this });
    this.groundSensor.setUserData({ tag: "ground-sensor", parent: this });

    adapter.world.on("begin-contact", this.beginContact.bind(this));
    adapter.world.on("end-contact", this.endContact.bind(this));

    adapter.bodies.get(this.body).setAlpha(0);
    adapter.bodies.get(this.groundSensor).setAlpha(0);

     for (
       let fixture = this.body.getFixtureList();
       fixture;
       fixture = fixture.getNext()
     ) {
       fixture.m_filterCategoryBits = 0x0002;
       fixture.m_filterMaskBits = 0x0001;
     }
  }

  public beginContact(contact: Contact) {
    if (contact.isTouching() && !this.enemy.dead) {
      const bodies = [
        contact.getFixtureA().getBody(),
        contact.getFixtureB().getBody(),
      ];
      const bodiesTag = this.identifyBodiesTag(bodies);
      if (bodiesTag.has("ground-sensor") && bodiesTag.has("ground")) {
        const ground = bodiesTag.get("ground-sensor");
        const { tag, parent } = ground.getUserData() as any;
        if (parent === this) {
          this.groundSensorsContact.add(contact);
        }
      }
      if (bodiesTag.has("sick-enemy-body")) {
        const { parent } = bodiesTag.get("sick-enemy-body").getUserData() as {
          parent: any;
        };
        if (parent && parent === this) {
          const movement = this.enemy.getComponent<EnemyMovement>("movement");
          if (
            bodiesTag.has("fireball") ||
            bodiesTag.has("player-defensive-balls")
          ) {
            if (bodiesTag.has("fireball")) {
              const { parent } = bodiesTag.get("fireball").getUserData() as any;
              if (parent) {
                let fireballBody: FireballBody = parent;
                fireballBody.destroyed = true;
              }
            }
            const avatar =
              playerInWorld.getComponent<PlayerAvatar>("player-avatar").avatar;
            movement.doKnockedback(avatar.image.scaleX);
          }
        }
      }

      if (bodiesTag.has("player")) {
        const player = playerInWorld;
        const playerBody = player.getComponent<PlayerBody>("player-body");
        const movement = player.getComponent<PlayerMovement>("player-movement");
        const playerPosition = playerBody.body.getPosition();

        const sickEnemyPosition = this.body.getPosition();

        const playerToSickEnemyDistance = Vec2.distance(
          playerPosition,
          sickEnemyPosition
        );

        const minDistanceToPlayerForAttack =
          enemies.sickEnemy.minDistanceToPlayerForAttack_enemy;
        if (playerToSickEnemyDistance < minDistanceToPlayerForAttack) {
          console.log("attacked");
          if (Math.random() > 0.5) {
            if (GameCore.remainPoison == 0) {
              GameCore.poisonTime = new Date().getTime();
              const playerAvatar =
                player.getComponent<PlayerAvatar>("player-avatar");
              playerAvatar.avatar.image.setTint(0x00e000);
              // const scene = this.sickEnemy.scene;
              // scene.tweens.add({
              //   targets: playerAvatar.avatar,
              //   alpha: {from: 1, to: 0},
              //   duration: 500,
              //   ease: "Linear",
              //   yoyo: true,
              //   repeat: -1,
              // })
            }
            GameCore.remainPoison = 3;
            console.log("poisoned", GameCore.remainPoison, GameCore.heart);
          }
        }
      }
    }
  }

  public endContact(contact: Contact) {
    if (!contact.isTouching() && !this.enemy.dead) {
      const bodies = [
        contact.getFixtureA().getBody(),
        contact.getFixtureB().getBody(),
      ];
      const bodiesTag = this.identifyBodiesTag(bodies);
      if (bodiesTag.has("ground-sensor") && bodiesTag.has("ground")) {
        const ground = bodiesTag.get("ground-sensor");
        const { tag, parent } = ground.getUserData() as any;

        if (parent === this) {
          this.groundSensorsContact.delete(contact);
        }
      }
    }
  }

  public landed: boolean = false;
  update() {
    const screenPosition = adapter.getScreenPosition(this.body.getPosition());
    this.enemy.x = this.enemy.container.x = Math.floor(screenPosition.x);
    this.enemy.y = this.enemy.container.y = Math.floor(screenPosition.y);

    if (!this.landed) {
      if (this.groundSensorsContact.size === 0) {
        const bodyVelocity = this.body.getLinearVelocity();
        if (bodyVelocity.y > 7) {
          bodyVelocity.y = 7;
        }
        this.body.setGravityScale(0.7);
      } else {
        this.body.setGravityScale(1);
        this.landed = true;
      }
    }
  }
}

import {
  Body,
  Box,
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
import { NightEnemy } from "../night-enemy";
import { PlayerState } from "../../../../../player/components/machine/states/state";
import { PlayerMachine } from "../../../../../player/components/machine/machine";
import { PlayerBody } from "../../../../../player/components/body";
import { GameCore } from "../../../../../../core/game";
import { PlayerAvatar } from "../../../../../player/components/avatar";
import { EnemyMovement } from "../../../../movement";
import { FireballBody } from "../../../../../player/components/abilities/fire/entity/fireball/components/body";
import { PlayerMovement } from "../../../../../player/components/movement";

const adapter = PlanckPhaserAdapter;

export class NightEnemyBody extends EnemyBody {
  public body: Body;

  public chestFixture: Fixture;
  public feetFixture: Fixture;

  public isTouchingPlayer: boolean = false;

  public groundSensor: Body;

  public constructor(nightEnemy: NightEnemy) {
    super(nightEnemy);
  }

  start() {
    const nightEnemy = this.enemy;
    const scene = this.enemy.scene;
    const worldScale = adapter.planckPhysics.worldScale;

    const bodyRadius = enemies.nightEnemy.enemyRadius;
    this.body = adapter.createCircle(nightEnemy.x, nightEnemy.y, bodyRadius, {
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
      10
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

    // this.nightEnemy.container.addAt(
    //   scene.add.rectangle(0, -25, 50, 50, 0xff0000),
    //   0
    // );

    const boydTagName = "night-enemy-body";
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

  public destroy() {
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
      if (bodiesTag.has("night-enemy-body")) {
        const { parent } = bodiesTag.get("night-enemy-body").getUserData() as {
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

  public dead(){
    adapter.world.destroyBody(this.body);
    adapter.world.destroyBody(this.groundSensor);
    adapter.world.off("begin-contact", this.beginContact.bind(this));
    adapter.world.off("end-contact", this.endContact.bind(this));
  }

}

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
import { EnemyBody } from "../../../../../enemies/body";
import { FireballBody } from "../../../../../player/components/abilities/fire/entity/fireball/components/body";
import { PlayerAvatar } from "../../../../../player/components/avatar";
import { playerInWorld } from "../../../../../player/player";
import { EnemyMovement } from "../../../../movement";
import { EggEnemy } from "../egg-enemy";

const adapter = PlanckPhaserAdapter;

export class EggEnemyBody extends EnemyBody {
  public leftSmallEggEnemySensor: Body;
  public rightSmallEggEnemySensor: Body;

  public isLeftSmallEggEnemySensorTouching = false;
  public isRightSmallEggEnemySensorTouching = false;

  public eggEnemy: EggEnemy;
  public constructor(public enemy: EggEnemy) {
    super(enemy);
    this.eggEnemy = enemy;
  }

  start() {
    const eggEnemy = this.eggEnemy;
    const scene = this.eggEnemy.scene;
    const worldScale = adapter.planckPhysics.worldScale;

    const bodyRadius = this.eggEnemy.isSmall
      ? enemies.eggEnemy.smallEnemyRadius
      : enemies.eggEnemy.largeEnemyRadius;
    this.body = adapter.createCircle(eggEnemy.x, eggEnemy.y, bodyRadius, {
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
      this.eggEnemy.x,
      this.eggEnemy.y + 25,
      10,
      4
    );
    this.groundSensor.setGravityScale(0);
    this.groundSensor.getFixtureList().setSensor(true);

    if (this.eggEnemy.isSmall) {
      this.leftSmallEggEnemySensor = adapter.createRectangle(
        eggEnemy.x,
        eggEnemy.y,
        enemies.eggEnemy.smallEnemySideSensorSize,
        enemies.eggEnemy.smallEnemySideSensorSize
      );
      this.leftSmallEggEnemySensor.setGravityScale(0);
      this.leftSmallEggEnemySensor.getFixtureList().setSensor(true);

      this.rightSmallEggEnemySensor = adapter.createRectangle(
        eggEnemy.x,
        eggEnemy.y,
        enemies.eggEnemy.smallEnemySideSensorSize,
        enemies.eggEnemy.smallEnemySideSensorSize
      );
      this.rightSmallEggEnemySensor.setGravityScale(0);
      this.rightSmallEggEnemySensor.getFixtureList().setSensor(true);
    }

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

    if (this.eggEnemy.isSmall) {
      const leftSmallEggEnemySensor_jointDef: RevoluteJointDef = {
        localAnchorA: Vec2(-20 * worldScale, 0),
        localAnchorB: Vec2(0, 0),
        bodyA: this.body,
        bodyB: this.leftSmallEggEnemySensor,
        referenceAngle: 0,
        enableMotor: true,
        maxMotorTorque: 20,
        collideConnected: false,
      };

      const rightSmallEggEnemySensor_jointDef: RevoluteJointDef = {
        localAnchorA: Vec2(20 * worldScale, 0),
        localAnchorB: Vec2(0, 0),
        bodyA: this.body,
        bodyB: this.rightSmallEggEnemySensor,
        referenceAngle: 0,
        enableMotor: true,
        maxMotorTorque: 20,
        collideConnected: false,
      };

      adapter.world.createJoint(
        RevoluteJoint(leftSmallEggEnemySensor_jointDef)
      );
      adapter.world.createJoint(
        RevoluteJoint(rightSmallEggEnemySensor_jointDef)
      );
    }

    adapter.world.createJoint(RevoluteJoint(revoluteJointDef));

    // this.eggEnemy.container.addAt(
    //   scene.add.rectangle(0, -25, 50, 50, 0xff0000),
    //   0
    // );

    const boydTagName = this.eggEnemy.isSmall
      ? "egg-small-enemy-body"
      : "egg-enemy-body";
    this.body.setUserData({ tag: boydTagName, parent: this });
    this.groundSensor.setUserData({ tag: "ground-sensor", parent: this });

    if (this.eggEnemy.isSmall) {
      this.leftSmallEggEnemySensor.setUserData({
        tag: "leftSmallEggEnemy-sensor",
        parent: this,
      });
      this.rightSmallEggEnemySensor.setUserData({
        tag: "rightSmallEggEnemy-sensor",
        parent: this,
      });
    }

    adapter.world.on("begin-contact", this.beginContact.bind(this));
    adapter.world.on("end-contact", this.endContact.bind(this));

    adapter.bodies.get(this.body).setAlpha(0);
    adapter.bodies.get(this.groundSensor).setAlpha(0);

    if (this.eggEnemy.isSmall) {
      adapter.bodies.get(this.leftSmallEggEnemySensor).setAlpha(0);
      adapter.bodies.get(this.rightSmallEggEnemySensor).setAlpha(0);
    }

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

      if (this.eggEnemy.isSmall) {
        if (
          bodiesTag.has("leftSmallEggEnemy-sensor") &&
          bodiesTag.has("egg-small-enemy-body")
        ) {
          const leftSmallEggEnemy_sensor = bodiesTag.get(
            "leftSmallEggEnemy-sensor"
          );
          const { tag, parent } = leftSmallEggEnemy_sensor.getUserData() as any;
          if (parent === this) {
            this.isLeftSmallEggEnemySensorTouching = true;
          }
        } else if (
          bodiesTag.has("rightSmallEggEnemy-sensor") &&
          bodiesTag.has("egg-small-enemy-body")
        ) {
          const rightSmallEggEnemy_sensor = bodiesTag.get(
            "rightSmallEggEnemy-sensor"
          );
          const { tag, parent } =
            rightSmallEggEnemy_sensor.getUserData() as any;
          if (parent === this) {
            this.isRightSmallEggEnemySensorTouching = true;
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

      if (bodiesTag.has("egg-small-enemy-body")) {
        const { parent } = bodiesTag
          .get("egg-small-enemy-body")
          .getUserData() as {
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

      if (this.eggEnemy.isSmall) {
        if (
          bodiesTag.has("leftSmallEggEnemy-sensor") &&
          bodiesTag.has("egg-small-enemy-body")
        ) {
          const leftSmallEggEnemy_sensor = bodiesTag.get(
            "leftSmallEggEnemy-sensor"
          );
          const { tag, parent } = leftSmallEggEnemy_sensor.getUserData() as any;
          if (parent === this) {
            this.isLeftSmallEggEnemySensorTouching = false;
          }
        } else if (
          bodiesTag.has("rightSmallEggEnemy-sensor") &&
          bodiesTag.has("egg-small-enemy-body")
        ) {
          const rightSmallEggEnemy_sensor = bodiesTag.get(
            "rightSmallEggEnemy-sensor"
          );
          const { tag, parent } =
            rightSmallEggEnemy_sensor.getUserData() as any;
          if (parent === this) {
            this.isRightSmallEggEnemySensorTouching = false;
          }
        }
      }
    }
  }

  update() {
    const screenPosition = adapter.getScreenPosition(this.body.getPosition());
    this.eggEnemy.x = this.eggEnemy.container.x = Math.floor(screenPosition.x);
    this.eggEnemy.y = this.eggEnemy.container.y = Math.floor(screenPosition.y);

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
    } else {
      this.body.setGravityScale(1.3);
    }
  }
}

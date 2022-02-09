import { Body, Box, Circle, Contact, Fixture, RevoluteJoint, RevoluteJointDef, Vec2 } from "planck-js";
import { GameCore } from "../../../../../../core/game";
import { enemies } from "../../../../../../helpers/vars";
import { PlanckPhaserAdapter } from "../../../../../../physic/planck-phaser-adapter";
import { PlayerMovement } from "../../../../../player/components/movement";
import { playerInWorld } from "../../../../../player/player";
import { EnemyBody } from "../../../../body";
import { LetterSystem } from "../../../../../letter-system/letter-system";
import { CycleEnemy } from "../cycle-enemy";
import { CycleEnemyMovement } from "./movement";
import { Enemy } from "../../../../enemy";

const adapter = PlanckPhaserAdapter;

export class CycleEnemyBody extends EnemyBody {
  public cycleEnemy: CycleEnemy;
  public body: Body;

  public constructor(enemy: CycleEnemy) {
    super(enemy);
    this.cycleEnemy = enemy;
  }

  start() {
    const cycleEnemy = this.cycleEnemy;
    const scene = this.cycleEnemy.scene;
    const worldScale = adapter.planckPhysics.worldScale;

    const bodyRadius = enemies.cycleEnemy.enemyRadius;
    this.body = adapter.createCircle(
      cycleEnemy.x,
      cycleEnemy.y,
      bodyRadius,
      { filterGroupIndex: -1, }
    );

    this.feetFixture = this.body.getFixtureList();
    this.chestFixture = this.body.createFixture({
      shape: Box(
        bodyRadius * worldScale,
        bodyRadius * worldScale,
        Vec2(0, -bodyRadius * worldScale + (53 * worldScale))
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
      this.cycleEnemy.x,
      this.cycleEnemy.y,
      100,
      40
    );
    this.groundSensor.setGravityScale(0);
    this.groundSensor.getFixtureList().setSensor(true);

    const revoluteJointDef: RevoluteJointDef = {
      localAnchorA: Vec2(0, 25 * worldScale),
      localAnchorB: Vec2(0, -25 * worldScale),
      bodyA: this.body,
      bodyB: this.groundSensor,
      referenceAngle: 0,
      enableMotor: true,
      maxMotorTorque: 20,
      collideConnected: false,
    };

    adapter.world.createJoint(RevoluteJoint(revoluteJointDef));

    // this.oceanEnemy.container.addAt(
    //   scene.add.rectangle(0, -25, 50, 50, 0xff0000),
    //   0
    // );

    const boydTagName = "cycle-enemy-body";
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

  update() {
    if(this.enemy.dead) return;

    if (this.enemy.life <= 0 && !this.enemy.dead) {
      this.enemy.dead = true;
      this.enemy.destroy();

      return;
    }

    const screenPosition = adapter.getScreenPosition(this.body.getPosition());
    this.cycleEnemy.x = this.cycleEnemy.container.x = Math.floor(screenPosition.x);
    this.cycleEnemy.y = this.cycleEnemy.container.y = Math.floor(screenPosition.y);

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

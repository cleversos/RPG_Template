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
import { <FTName | pascalcase>Enemy } from "../<FTName>-enemy";

const adapter = PlanckPhaserAdapter;

export class <FTName | pascalcase>EnemyBody extends EnemyBody {
  public <FTName | camelcase>Enemy: <FTName | pascalcase>Enemy;
  public constructor(public enemy: <FTName | pascalcase>Enemy) {
    super(enemy);
    this.<FTName | camelcase>Enemy = enemy;
  }

  start() {
    const <FTName | camelcase>Enemy = this.<FTName | camelcase>Enemy;
    const scene = this.<FTName | camelcase>Enemy.scene;
    const worldScale = adapter.planckPhysics.worldScale;

    const bodyRadius = 25;
    this.body = adapter.createCircle(<FTName | camelcase>Enemy.x, <FTName | camelcase>Enemy.y, bodyRadius, {
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
      this.<FTName | camelcase>Enemy.x,
      this.<FTName | camelcase>Enemy.y + 25,
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

    // this.<FTName | camelcase>.container.addAt(
    //   scene.add.rectangle(0, -25, 50, 50, 0xff0000),
    //   0
    // );

    const boydTagName = "<FTName>-enemy-body";
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
    const screenPosition = adapter.getScreenPosition(this.body.getPosition());
    this.<FTName | camelcase>Enemy.x = this.<FTName | camelcase>Enemy.container.x = Math.floor(screenPosition.x);
    this.<FTName | camelcase>Enemy.y = this.<FTName | camelcase>Enemy.container.y = Math.floor(screenPosition.y);

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

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
import { PlanckPhaserAdapter } from "../../physic/planck-phaser-adapter";
import { EntityComponent } from "../entity";
import { Enemy } from "./enemy";

const adapter = PlanckPhaserAdapter;

export class EnemyBody extends EntityComponent {
  public body: Body;

  public chestFixture: Fixture;
  public feetFixture: Fixture;

  public isTouchingPlayer: boolean = false;
  public landed: boolean = false;

  public groundSensor: Body;

  public constructor(public enemy: Enemy) {
    super();
  }

  public groundSensorsContact: Set<Contact> = new Set();

  public destroy() {
    if (this.body) adapter.world.destroyBody(this.body);
    if (this.groundSensor) adapter.world.destroyBody(this.groundSensor);
    adapter.world.off("begin-contact", this.beginContact.bind(this));
    adapter.world.off("end-contact", this.endContact.bind(this));
  }

  public beginContact(contact: Contact): void {}
  public endContact(contact: Contact): void {}

  public identifyBodiesTag(bodies: Body[]) {
    const tags: Map<string, Body> = new Map();
    bodies.forEach((body) => {
      const data = body.getUserData() as { tag: string };
      if (data && data.tag) {
        tags.set(data.tag, body);
      }
    });
    return tags;
  }

  public identifyBodies(
    contact: Contact,
    ref: Fixture
  ): undefined | [Body, Body] {
    const fixtureA = contact.getFixtureA();
    const fixtureB = contact.getFixtureB();

    let fixture: Fixture | undefined =
      fixtureA === ref ? fixtureA : fixtureB === ref ? fixtureB : undefined;

    if (!fixture) return undefined;

    const bodies: [Body, Body] =
      fixtureA === fixture
        ? [fixtureA.getBody(), fixtureB.getBody()]
        : [fixtureB.getBody(), fixtureA.getBody()];

    return bodies;
  }
}

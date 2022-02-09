import { Body } from "planck-js";
import { PlanckPhaserAdapter } from "../../../../../../../../physic/planck-phaser-adapter";
import { EntityComponent } from "../../../../../../../entity";
import { Puddle } from "../puddle";
import { PuddleAnimation } from "./animation";

const adapter = PlanckPhaserAdapter;

export class PuddleBody extends EntityComponent {
  public body: Body;
  public constructor(public parent: Puddle) {
    super();
  }

  public start() {
    const parent = this.parent;
    const worldScale = adapter.planckPhysics.worldScale;
    const animationObject =
      this.parent.getComponent<PuddleAnimation>("animation").animationObject;

    this.body = adapter.createRectangle(
      parent.x,
      parent.y,
      animationObject.image.width,
      animationObject.image.height
    );
    this.body.setStatic();
    this.body.getFixtureList().setSensor(true);

    this.body.setUserData({ tag: "puddle", parent: this });

    adapter.bodies.get(this.body).setAlpha(0);
  }

  public destroy() {
    if (this.body) {
      adapter.world.destroyBody(this.body);
    }
  }
}

import { AnimationObject } from "../../../../../../../animation/animation";
import { EntityComponent } from "../../../../../../entity";
import { Bullet } from "../bullet";
import { BulletBody } from "./body";

export class BulletAnimation extends EntityComponent {
  public animation: AnimationObject;
  public constructor(public parent: Bullet) {
    super();
  }

  public start() {
    const parent = this.parent;
    const { scene, container } = parent;
    this.animation = new AnimationObject(scene, "6", 0, 0);
    container.add(this.animation.image);
  }

  public update() {
    const bulletBody = this.parent.getComponent<BulletBody>("body");
    if (bulletBody && bulletBody.destroyed) {
      if (this.animation.action !== 1) {
        this.animation.loop = false;
        this.animation.playAction(1);
        this.animation.image.setScale(0.5);
        return;
      } else {
        const end = this.animation.getAnimationSize();
        if (this.animation.frame + 1 === end) {
          this.parent.destroy();
        }
      }
    }
  }
}

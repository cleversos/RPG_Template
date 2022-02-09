import { AnimationObject } from "../../../../../../../../animation/animation";
import { EntityComponent } from "../../../../../../../entity";
import { WaterSplash } from "../water-splash";

export class WaterSplashAnimation extends EntityComponent {
  public animationObject: AnimationObject;
  public constructor(public parent: WaterSplash) {
    super();
  }

  public start() {
    const parent = this.parent;
    const scene = parent.scene;
    this.animationObject = new AnimationObject(scene, "5", 0, 0);
    this.animationObject.loop = false;
    this.animationObject.action = 2;
    this.animationObject.playAction(2, true);

    this.animationObject.image.setDepth(14);

    parent.container.add(this.animationObject.image);
  }

  public update() {
    const end = this.animationObject.getAnimationSize();
    if (this.animationObject.frame + 1 === end) {
      this.parent.destroy();
    }
  }
}

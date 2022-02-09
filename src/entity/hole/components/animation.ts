import { AnimationObject } from "../../../animation/animation";
import { EntityComponent } from "../../entity";
import { Hole } from "../hole";

export class HoleAnimation extends EntityComponent {
  public animationObject: AnimationObject;
  public constructor(public parent: Hole) {
    super();
  }

  public start() {
    this.animationObject = new AnimationObject(this.parent.scene, "3", 0, 0);
    this.animationObject.framerate = 1000 / 60;
    this.parent.container.add(this.animationObject.image);

    this.parent.container.setDepth(17);
  }
}

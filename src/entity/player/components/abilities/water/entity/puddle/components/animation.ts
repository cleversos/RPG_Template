import { AnimationObject } from "../../../../../../../../animation/animation";
import { MainScene } from "../../../../../../../../scene/main-scene";
import { EntityComponent } from "../../../../../../../entity";
import { Puddle } from "../puddle";

export class PuddleAnimation extends EntityComponent {
  public scene: MainScene;
  public animationObject: AnimationObject;
  public puddleDelay: number;
  public puddleDisappear: boolean = false;
  public constructor(public parent: Puddle) {
    super();
    this.scene = parent.scene;
  }

  public getRandom(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min));
  }

  public start() {
    const parent = this.parent;
    const scene = this.scene;
    this.puddleDelay = this.getRandom(5000, 6000);
    this.animationObject = new AnimationObject(scene, "5", 0, 0);

    this.animationObject.image.setAlpha(0);
    scene.tweens.add({
      targets: [this.animationObject.image],
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        parent.addBody();
      },
    });

    parent.container.add(this.animationObject.image);
  }

  public update() {
    if (!this.puddleDisappear) {
      if (this.animationObject.image.alpha === 1) {
        if (this.puddleDelay > 0) {
          this.puddleDelay -= 1000 / 80;
        } else {
          this.puddleDisappear = true;
          this.scene.tweens.add({
            targets: [this.animationObject.image],
            alpha: 0,
            duration: 1000,
            onComplete: () => {
              this.parent.destroy();
            },
          });
        }
      }
    }
  }
}

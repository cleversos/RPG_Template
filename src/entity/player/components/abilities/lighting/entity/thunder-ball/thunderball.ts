import { AnimationObject } from "../../../../../../../animation/animation";
import { MainScene } from "../../../../../../../scene/main-scene";
import { Entity } from "../../../../../../entity";
import { FireballBody } from "./components/body";

export class ThunderBall extends Entity {
  public container: Phaser.GameObjects.Container;
  public fireAnimation: AnimationObject;
  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene
  ) {
    super();
    this.container = scene.add.container(x, y);

    this.container.update = () => {
      this.update();
    };

    const fire = new AnimationObject(scene, "7", 0, -10);
    fire.action = 2;
    fire.getFrame();
    const { width, height } = fire.image;
    fire.image.setDisplaySize(width * 0.4, height * 0.4);
    this.fireAnimation = fire;

    this.container.add(fire.image);

    this.addComponent("body", new FireballBody(this));

    this.awake();
    this.start();

    scene.entity.add(this.container);
  }

  destroy() {
    if (this.container) this.container.destroy();
    console.log("Destroy fireball");
    super.destroy();
  }
}

import { MainScene } from "../../../../../../../scene/main-scene";
import { Entity } from "../../../../../../entity";
import { WaterOne } from "../../water-one";
import { PuddleAnimation } from "./components/animation";
import { PuddleBody } from "./components/body";

export class Puddle extends Entity {
  public container: Phaser.GameObjects.Container;
  public scene: MainScene;

  public constructor(
    public parent: WaterOne,
    public x: number,
    public y: number
  ) {
    super();
    const scene = (this.scene = parent.scene);
    this.container = scene.add.container(x, y);
    this.container.update = () => this.update();
    this._initComponents();

    this.awake();
    this.start();

    scene.entity.add(this.container);
  }

  private _initComponents() {
    this.addComponent("animation", new PuddleAnimation(this));
  }

  public addBody() {
    const puddleBody = new PuddleBody(this);
    puddleBody.awake();
    puddleBody.start();
    this.addComponent("body", puddleBody);
  }

  public destroy() {
    if (this.container) {
      this.container.destroy();
      this.container = undefined;
    }
    super.destroy();
  }
}

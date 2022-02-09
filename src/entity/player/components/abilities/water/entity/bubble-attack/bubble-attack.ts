import { MainScene } from "../../../../../../../scene/main-scene";
import { Entity } from "../../../../../../entity";
import { BubbleAnimation } from "./components/animation";
import { BubbleBody } from "./components/body";

export class BubbleAttack extends Entity {
  public container: Phaser.GameObjects.Container;
  public explosionOver: boolean = false;
  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene
  ) {
    super();
    this.container = scene.add.container(x, y);
    this.container.update = () => this.update();

    this._initComponents();
    this.awake();
    this.start();

    scene.entity.add(this.container);
  }

  private _initComponents() {
    this.addComponent("animation", new BubbleAnimation(this));
    this.addComponent("body", new BubbleBody(this));
  }

  public destroy() {
    if (this.container) {
      this.container.destroy();
      this.container = undefined;
    }

    super.destroy();
    this.explosionOver = true;
  }
}

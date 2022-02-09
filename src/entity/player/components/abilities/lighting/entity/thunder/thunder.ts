import { MainScene } from "../../../../../../../scene/main-scene";
import { Entity } from "../../../../../../entity";
import { ThunderAnimation } from "./components/animation";
import { ThunderBody } from "./components/body";

export class ThunderAttack extends Entity {
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
    this.addComponent("animation", new ThunderAnimation(this));
    this.addComponent("body", new ThunderBody(this));
  }

  public destroy() {
    if (this.container) {
      this.container.destroy();
      this.container = undefined;
    }
    this.explosionOver = true;
    super.destroy();
  }
}

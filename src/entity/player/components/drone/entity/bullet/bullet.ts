import { MainScene } from "../../../../../../scene/main-scene";
import { Entity } from "../../../../../entity";
import { BulletAnimation } from "./components/animation";
import { BulletBody } from "./components/body";

export class Bullet extends Entity {
  public container: Phaser.GameObjects.Container;
  public constructor(
    public x: number,
    public y: number,
    public dx: number,
    public dy: number,
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
    this.addComponent("animation", new BulletAnimation(this));
    this.addComponent("body", new BulletBody(this));
  }

  public destroy() {
    if (this.container) {
      this.container.destroy();
      this.container = undefined;
    }
    super.destroy();
  }
}

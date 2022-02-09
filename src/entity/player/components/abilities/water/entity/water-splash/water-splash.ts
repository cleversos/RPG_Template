import { MainScene } from "../../../../../../../scene/main-scene";
import { Entity } from "../../../../../../entity";
import { WaterSplashAnimation } from "./components/animation";

export class WaterSplash extends Entity {
  public container: Phaser.GameObjects.Container;
  public constructor(
    public scene: MainScene,
    public x: number,
    public y: number
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
    this.addComponent("animation", new WaterSplashAnimation(this));
  }

  public destroy() {
    if (this.container) {
      this.container.destroy();
      this.container = undefined;
    }
    super.destroy();
  }
}

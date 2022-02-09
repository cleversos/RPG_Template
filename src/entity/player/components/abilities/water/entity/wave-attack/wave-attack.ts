import { MainScene } from "../../../../../../../scene/main-scene";
import { Entity } from "../../../../../../entity";
import { WaveAttackAnimation } from "./components/animation";
import { WaveAttackBody } from "./components/body";

export class WaveAttack extends Entity {
  public container: Phaser.GameObjects.Container;
  public waveOver: boolean = false;
  public constructor(
    public x: number,
    public y: number,
    public direction: number,
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
    this.addComponent("animation", new WaveAttackAnimation(this));
    this.addComponent("body", new WaveAttackBody(this));
  }

  public destroy() {
    if (this.container) {
      this.container.destroy();
      this.container = undefined;
    }
    super.destroy();
  }
}

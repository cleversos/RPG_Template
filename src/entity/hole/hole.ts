import { GameScene } from "../../scene/game-scene";
import { Entity } from "../entity";
import { HoleAnimation } from "./components/animation";
import { HoleController } from "./components/controller";

export class Hole extends Entity {
  public container: Phaser.GameObjects.Container;
  public constructor(
    public x: number,
    public y: number,
    public scene: GameScene
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
    this.addComponent("hole-animation", new HoleAnimation(this));
    this.addComponent("hole-controller", new HoleController(this));
  }

  public destroy() {
    if (this.container) {
      this.container.destroy();
      this.container = undefined;
    }
    super.destroy();
  }
}

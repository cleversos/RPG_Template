import { GameCore } from "../../core/game";
import { MainScene } from "../../scene/main-scene";
import { Entity } from "../entity";

export class Enemy extends Entity {
  public static EnemyCount: number = 0;

  public container: Phaser.GameObjects.Container;
  public name: string;
  public life: number;
  public dead: boolean = false;

  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene,
    public direction: number = 1
  ) {
    super();
    this.container = scene.add.container(x, y);
    this.container.update = () => this.update();
    Enemy.ModifyEnemyCount(+1);
    console.log("Spawn enemy. Total enemies:", Enemy.EnemyCount);
  }

  public initComponents(): void {}

  public awake(): void {
    this.life += GameCore.waveCount > 1 ? (GameCore.waveCount / 2) * 100 : 20;
    super.awake();
  }

  public destroy() {
    if (this.container) {
      this.container.destroy();
      this.container = undefined;
    }
    Enemy.ModifyEnemyCount(-1);
    // console.log("let's call enemy.destroy", Enemy.EnemyCount);
    super.destroy();
  }

  public static ModifyEnemyCount(value: number) {
    Enemy.EnemyCount += value;
  }
}

import { MainScene } from "../../../scene/main-scene";
import { Enemy } from "../enemy";

export class RangedEnemy extends Enemy {
  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene,
    public direction: number = 1,
  ) {
    super(x, y, scene, direction);
  }
}

import { Vec2 } from "planck-js";
import { EnemyMovement } from "../../../../../enemies/movement";
import { EggProjectile } from "../egg-projectile";
import { EggProjectileMachine } from "./machine/machine";

export class EggProjectileMovement extends EnemyMovement {
  public inputs: Phaser.Types.Input.Keyboard.CursorKeys;
  public speed: Vec2 = Vec2(15, 24);
  public eggProjectile: EggProjectile;
  public constructor(public enemy: EggProjectile) {
    super(enemy);
    this.eggProjectile = enemy;
  }

  start() {
    this.machine = new EggProjectileMachine(this.eggProjectile);
  }

  update() {
    this.machine.update();
  }
}

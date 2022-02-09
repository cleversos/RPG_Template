import { Vec2 } from "planck-js";
import { EnemyMovement } from "../../../../../enemies/movement";
import { LavaProjectile } from "../lava-projectile";
import { LavaProjectileMachine } from "./machine/machine";

export class LavaProjectileMovement extends EnemyMovement {
  public inputs: Phaser.Types.Input.Keyboard.CursorKeys;
  public speed: Vec2 = Vec2(15, 24);
  public lavaProjectile: LavaProjectile;
  public constructor(public enemy: LavaProjectile) {
    super(enemy);
    this.lavaProjectile = enemy;
  }

  start() {
    this.machine = new LavaProjectileMachine(this.lavaProjectile);
  }

  update() {
    this.machine.update();
  }
}

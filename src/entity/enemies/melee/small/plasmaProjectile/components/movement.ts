import { Vec2 } from "planck-js";
import { EnemyMovement } from "../../../../movement";
import { PlasmaProjectile } from "../plasma-projectile";
import { PlasmaProjectileMachine } from "./machine/machine";

export class PlasmaProjectileMovement extends EnemyMovement {
  public inputs: Phaser.Types.Input.Keyboard.CursorKeys;
  public speed: Vec2 = Vec2(15, 24);
  public plasmaProjectile: PlasmaProjectile;
  public constructor(public enemy: PlasmaProjectile) {
    super(enemy);
    this.plasmaProjectile = enemy;
  }

  start() {
    this.machine = new PlasmaProjectileMachine(this.plasmaProjectile);
  }

  update() {
    this.machine.update();
  }
}

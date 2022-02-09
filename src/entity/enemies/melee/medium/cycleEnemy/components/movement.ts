import { EnemyMovement } from "../../../../../enemies/movement";
import { CycleEnemy } from "../cycle-enemy";
import { CycleEnemyMachine } from "./machine/machine";

export class CycleEnemyMovement extends EnemyMovement {
  public inputs: Phaser.Types.Input.Keyboard.CursorKeys;
  public cycleEnemy: CycleEnemy;
  public moveSpeed = 10;
  public constructor(public enemy: CycleEnemy) {
    super(enemy);
    this.cycleEnemy = enemy;
  }

  start() {
    this.machine = new CycleEnemyMachine(this.cycleEnemy);
  }
}

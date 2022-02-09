import { enemies } from "../../../../../../helpers/vars";
import { EnemyMovement } from "../../../../movement";
import { SickEnemy } from "../sick-enemy";
import { SickEnemyMachine } from "./machine/machine";

export class SickEnemyMovement extends EnemyMovement {
  public moveSpeed = enemies.sickEnemy.xMoveSpeedRange.getRandom();
  public constructor(sickEnemy: SickEnemy) {
    super(sickEnemy);
    this.enemy = sickEnemy;
  }

  start() {
    this.machine = new SickEnemyMachine(this.enemy);
  }
}

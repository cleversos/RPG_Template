import { enemies } from "../../../../../../helpers/vars";
import { EnemyMovement } from "../../../../movement";
import { PlasmaEnemy } from "../plasma-enemy";
import { PlasmaEnemyMachine } from "./machine/machine";

export class PlasmaEnemyMovement extends EnemyMovement {
  public plasmaEnemy: PlasmaEnemy;
  public machine: PlasmaEnemyMachine;
  public moveSpeed = 10;
  public minDistanceToPlayerForAttack = enemies.plasmaEnemy.minDistanceToPlayerForAttack_range.getRandom();
  public constructor(enemy: PlasmaEnemy) {
    super(enemy);
    this.plasmaEnemy = enemy;
    // this.moveSpeed = enemies.plasma.xMoveSpeedRange.getRandom();
  }

  start() {
    this.machine = new PlasmaEnemyMachine(this.plasmaEnemy);
  }
}

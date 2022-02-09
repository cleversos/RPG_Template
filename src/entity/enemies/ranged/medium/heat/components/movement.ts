import { enemies } from "../../../../../../helpers/vars";
import { EnemyMovement } from "../../../../movement";
import { HeatEnemy } from "../heat-enemy";
import { HeatEnemyMachine } from "./machine/machine";

export class HeatEnemyMovement extends EnemyMovement {
  public heatEnemy: HeatEnemy;
  public machine: HeatEnemyMachine;
  public moveSpeed = 10;
  public minDistanceToPlayerForAttack = enemies.heatEnemy.minDistanceToPlayerForAttack_range.getRandom();
  public constructor(enemy: HeatEnemy) {
    super(enemy);
    this.heatEnemy = enemy;
    // this.moveSpeed = enemies.heat.xMoveSpeedRange.getRandom();
  }

  start() {
    this.machine = new HeatEnemyMachine(this.heatEnemy);
  }
}

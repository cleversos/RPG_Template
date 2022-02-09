import { EnemyMachine } from "../../../../../machine";
import { HeatEnemy } from "../../heat-enemy";
import { HeatEnemyAvatar } from "../avatar";
import { HeatEnemyMovement } from "../movement";
import { IdleState } from "./states/idle";

export class HeatEnemyMachine extends EnemyMachine {
  public heatEnemy: HeatEnemy;
  public constructor(enemy: HeatEnemy) {
    super(enemy);
    this.heatEnemy = enemy;
    this.avatar = enemy.getComponent<HeatEnemyAvatar>("avatar");
    this.movement = enemy.getComponent<HeatEnemyMovement>("movement");
    this.state = new IdleState(this);
    this.state.enter();
  }
}

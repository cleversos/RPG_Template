import { EggEnemy } from "../../egg-enemy";
import { EggEnemyAvatar } from "../avatar";
import { EggEnemyMovement } from "../movement";
import { IdleState } from "./states/idle";
import { EggEnemyState } from "./states/state";
import { EnemyMachine } from "../../../../../machine";
import { Enemy } from "../../../../../enemy";

export class EggEnemyMachine extends EnemyMachine {
  public eggEnemy: EggEnemy;
  public constructor(enemy: EggEnemy) {
    super(enemy);
    this.eggEnemy = enemy;
    this.avatar = enemy.getComponent<EggEnemyAvatar>("avatar");
    this.movement = enemy.getComponent<EggEnemyMovement>("movement");
    this.state = new IdleState(this);
    this.state.enter();
  }
}

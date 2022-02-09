import { OceanEnemy } from "../../ocean-enemy";
import { OceanEnemyAvatar } from "../avatar";
import { OceanEnemyMovement } from "../movement";
import { IdleState } from "./states/idle";
import { OceanEnemyState } from "./states/state";
import { EnemyMachine } from "../../../../../machine";
import { Enemy } from "../../../../../enemy";

export class OceanEnemyMachine extends EnemyMachine {
  public oceanEnemy: OceanEnemy;
  public constructor(enemy: OceanEnemy) {
    super(enemy);
    this.oceanEnemy = enemy;
    this.avatar = enemy.getComponent<OceanEnemyAvatar>("avatar");
    this.movement = enemy.getComponent<OceanEnemyMovement>("movement");
    this.state = new IdleState(this);
    this.state.enter();
  }
}

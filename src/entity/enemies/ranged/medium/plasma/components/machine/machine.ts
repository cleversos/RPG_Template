import { EnemyMachine } from "../../../../../machine";
import { PlasmaEnemy } from "../../plasma-enemy";
import { PlasmaEnemyAvatar } from "../avatar";
import { PlasmaEnemyMovement } from "../movement";
import { IdleState } from "./states/idle";

export class PlasmaEnemyMachine extends EnemyMachine {
  public enemy: PlasmaEnemy;
  public constructor(enemy: PlasmaEnemy) {
    super(enemy);
    this.enemy = enemy;
    this.avatar = enemy.getComponent<PlasmaEnemyAvatar>("avatar");
    this.movement = enemy.getComponent<PlasmaEnemyMovement>("movement");
    this.state = new IdleState(this);
    this.state.enter();
  }
}

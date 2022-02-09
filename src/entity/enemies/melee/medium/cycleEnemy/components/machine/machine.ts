import { CycleEnemyAvatar } from "../avatar";
import { EnemyMachine } from "../../../../../machine";
import { CycleEnemyMovement } from "../movement";
import { CycleEnemyState } from "./states/state";
import { CycleEnemy } from "../../cycle-enemy";
import { IdleState } from "./states/idle";

export class CycleEnemyMachine extends EnemyMachine {
  public state: CycleEnemyState;
  public hasCollided = false;
  public movement: CycleEnemyMovement;

  public constructor(enemy: CycleEnemy) {
    super(enemy);
    this.avatar = enemy.getComponent<CycleEnemyAvatar>("avatar");
    this.state = new IdleState(this);
    this.state.enter();
  }
}

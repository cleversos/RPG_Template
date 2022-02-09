import { SickEnemy } from "../../sick-enemy";
import { SickEnemyAvatar } from "../avatar";
import { SickEnemyMovement } from "../movement";
import { IdleState } from "./states/idle";
import { SickEnemyState } from "./states/state";
import { EnemyMachine } from "../../../../../machine";

export class SickEnemyMachine extends EnemyMachine{
  public constructor(sickEnemy: SickEnemy) {
    super(sickEnemy);
    this.avatar = sickEnemy.getComponent<SickEnemyAvatar>("avatar");
    this.movement = sickEnemy.getComponent<SickEnemyMovement>("movement");
    this.state = new IdleState(this);
    this.state.enter();
  }
}

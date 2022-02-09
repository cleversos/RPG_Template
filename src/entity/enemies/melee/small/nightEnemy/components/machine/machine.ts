import { NightEnemy } from "../../night-enemy";
import { NightEnemyAvatar } from "../avatar";
import { NightEnemyMovement } from "../movement";
import { IdleState } from "./states/idle";
import { NightEnemyState } from "./states/state";
import { EnemyMachine } from "../../../../../machine";

export class NightEnemyMachine extends EnemyMachine{
  public constructor(nightEnemy: NightEnemy) {
    super(nightEnemy);
    this.avatar = nightEnemy.getComponent<NightEnemyAvatar>("avatar");
    this.movement = nightEnemy.getComponent<NightEnemyMovement>("movement");
    this.state = new IdleState(this);
    this.state.enter();
  }
}

import { BubbleEnemy } from "../../bubble-enemy";
import { BubbleEnemyAvatar } from "../avatar";
import { LaunchState } from "./states/launch";
import { BubbleEnemyState } from "./states/state";
import { EnemyMachine } from "../../../../../machine";
import { BubbleEnemyMovement } from "../movement";

export class BubbleEnemyMachine extends EnemyMachine {
  public state: BubbleEnemyState;
  public hasCollided = false;
  public movement: BubbleEnemyMovement;

  public constructor(enemy: BubbleEnemy) {
    super(enemy);
    this.avatar = enemy.getComponent<BubbleEnemyAvatar>("avatar");
    this.state = new LaunchState(this);
    this.state.enter();
  }
}

import { <FTName | pascalcase>Enemy } from "../../<FTName>-enemy";
import { <FTName | pascalcase>EnemyAvatar } from "../avatar";
import { <FTName | pascalcase>EnemyMovement } from "../movement";
import { IdleState } from "./states/idle";

export class <FTName | pascalcase>EnemyMachine extends EnemyMachine {
  public <FTName | camelcase>Enemy: <FTName | pascalcase>Enemy;
  public constructor(enemy: <FTName | pascalcase>Enemy) {
    super(enemy);
    this.<FTName | camelcase>Enemy = enemy;
    this.avatar = enemy.getComponent<<FTName | pascalcase>EnemyAvatar>("avatar");
    this.movement = enemy.getComponent<<FTName | pascalcase>EnemyMovement>("movement");
    this.state = new IdleState(this);
    this.state.enter();
  }
}

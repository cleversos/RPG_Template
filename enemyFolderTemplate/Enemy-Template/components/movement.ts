import { <FTName | pascalcase>Enemy } from "../<FTName>-enemy";
import { <FTName | pascalcase>EnemyMachine } from "./machine/machine";

export class <FTName | pascalcase>EnemyMovement extends EnemyMovement {
  public <FTName | camelcase>Enemy: <FTName | pascalcase>Enemy;
  public machine: <FTName | pascalcase>EnemyMachine;
  public constructor(enemy: <FTName | pascalcase>Enemy) {
    super(enemy);
    this.<FTName | camelcase>Enemy = enemy;
    // this.moveSpeed = enemies.<FTName | camelcase>.xMoveSpeedRange.getRandom();
  }

  start() {
    this.machine = new <FTName | pascalcase>EnemyMachine(this.<FTName | camelcase>Enemy);
  }
}

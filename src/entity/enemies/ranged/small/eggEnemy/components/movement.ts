import { enemies } from "../../../../../../helpers/vars";
import { EnemyMovement } from "../../../../../enemies/movement";
import { EggEnemy } from "../egg-enemy";
import { EggEnemyMachine } from "./machine/machine";

export class EggEnemyMovement extends EnemyMovement {
  public eggEnemy: EggEnemy;
  public machine: EggEnemyMachine;
  public constructor(enemy: EggEnemy) {
    super(enemy);
    this.eggEnemy = enemy;
    this.moveSpeed = enemies.eggEnemy.xMoveSpeedRange.getRandom();
  }

  start() {
    this.machine = new EggEnemyMachine(this.eggEnemy);
  }
}

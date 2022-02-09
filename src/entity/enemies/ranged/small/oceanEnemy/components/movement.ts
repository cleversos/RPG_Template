import { enemies } from "../../../../../../helpers/vars";
import { EnemyMovement } from "../../../../../enemies/movement";
import { OceanEnemy } from "../ocean-enemy";
import { OceanEnemyMachine } from "./machine/machine";

export class OceanEnemyMovement extends EnemyMovement {
  public oceanEnemy: OceanEnemy;
  public machine: OceanEnemyMachine;
  public constructor(enemy: OceanEnemy) {
    super(enemy);
    this.oceanEnemy = enemy;
    this.moveSpeed = enemies.oceanEnemy.xMoveSpeedRange.getRandom();
  }

  start() {
    this.machine = new OceanEnemyMachine(this.oceanEnemy);
  }
}

import { enemies } from "../../../../../../helpers/vars";
import { EnemyMovement } from "../../../../movement";
import { NightEnemy } from "../night-enemy";
import { NightEnemyBody } from "./body";
import { NightEnemyMachine } from "./machine/machine";

export class NightEnemyMovement extends EnemyMovement {
  public moveSpeed = enemies.nightEnemy.xMoveSpeedRange.getRandom();
  public constructor(nightEnemy: NightEnemy) {
    super(nightEnemy);
    this.enemy = nightEnemy;
  }

  start() {
    this.machine = new NightEnemyMachine(this.enemy);
  }

  public doKnockedback(nDirection: number, fx: number = 9, fy: number = 0) {
    const nightEnemyBody =
    this.machine.enemy.getComponent<NightEnemyBody>("body");
    nightEnemyBody.landed = false;
    super.doKnockedback(nDirection, fx, fy);
  }
}

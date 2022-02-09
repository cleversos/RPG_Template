import { Vec2 } from "planck-js";
import { enemies, logColors } from "../../../../../../../../helpers/vars";
import { PlayerBody } from "../../../../../../../player/components/body";
import { playerInWorld } from "../../../../../../../player/player";
import { CycleEnemyBody } from "../../body";
import { CycleEnemyMachine } from "../machine";
import { AttackingRunningState } from "./attacking-running";
import { CycleEnemyState } from "./state";

export class IdleState extends CycleEnemyState {
  public constructor(public machine: CycleEnemyMachine) {
    super(machine);

    const attackingRunningTransition = (machine: CycleEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;

      if (avatar && movement && playerInWorld) {
        const cycleEnemyBody = machine.enemy.getComponent<CycleEnemyBody>("body");

        if (cycleEnemyBody.groundSensorsContact.size === 0) return;

        const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
        const playerPosition = playerBody.body.getPosition();

        const cycleEnemyPosition = cycleEnemyBody.body.getPosition();

        const playerToCycleEnemyDistance = Vec2.distance(playerPosition, cycleEnemyPosition);

        const minDistanceToPlayerForAttackingRunning = enemies.cycleEnemy.minDistanceToPlayerForAttackingRunning;
        if (playerToCycleEnemyDistance < minDistanceToPlayerForAttackingRunning) {
          this.machine.state = new AttackingRunningState(machine);
          this.machine.state.enter();
          return true;
        }
      }
    };

    this.transitions.set("attackingRunning", attackingRunningTransition);
  }

  enter() {
    if (enemies.cycleEnemy.isLogStateChanges) console.log('%cEnemy ' + this.machine.enemy.name + ' %centered state: ' + 'IdleState', enemies.cycleEnemy.logColor, logColors.state);
  }

  update() {
    super.update();
  }
}

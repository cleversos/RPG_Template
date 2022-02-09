import { Vec2 } from "planck-js";
import { enemies, logColors } from "../../../../../../../../helpers/vars";
import { adapter } from "../../../../../../../../scene/main-scene";
import { PlayerBody } from "../../../../../../../player/components/body";
import { PlayerMovement } from "../../../../../../../player/components/movement";
import { playerInWorld } from "../../../../../../../player/player";
import { CycleEnemyBody } from "../../body";
import { CycleEnemyMachine } from "../machine";
import { AttackingRunningState } from "./attacking-running";
import { CycleEnemyState } from "./state";

export class MeleeAttackingState extends CycleEnemyState {
  private target_timeBefore_meleeAttack_ms = 2000;
  private current_timeBefore_meleeAttack_ms = this.target_timeBefore_meleeAttack_ms;

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

        const minDistanceToPlayerToExitMeleeAttackState = enemies.cycleEnemy.minDistanceToPlayerToExitMeleeAttackState;
        if (playerToCycleEnemyDistance > minDistanceToPlayerToExitMeleeAttackState) {
          this.machine.state = new AttackingRunningState(machine);
          this.machine.state.enter();
          return true;
        }
      }
    };

    this.transitions.set("attackingRunning", attackingRunningTransition);
  }

  enter() {
    if (enemies.cycleEnemy.isLogStateChanges) console.log('%cEnemy ' + this.machine.enemy.name + ' %centered state: ' + 'MeleeAttackingState', enemies.cycleEnemy.logColor, logColors.state);
  }

  update() {
    this.decrementAttackTimer();

    super.update();
  }

  decrementAttackTimer() {
    this.current_timeBefore_meleeAttack_ms -= adapter.deltaTime;

    if (this.current_timeBefore_meleeAttack_ms <= 0) {
      this.do_meleeAttack();

      this.current_timeBefore_meleeAttack_ms = this.target_timeBefore_meleeAttack_ms;
    }
  }

  do_meleeAttack() {
    const player = playerInWorld;
    const movement =
      player.getComponent<PlayerMovement>("player-movement");
    movement.knockback(this.machine.enemy.direction);
  }
}

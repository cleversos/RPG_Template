import { Vec2 } from "planck-js";
import { enemies, logColors } from "../../../../../../../../helpers/vars";
import { PlayerBody } from "../../../../../../../player/components/body";
import { playerInWorld } from "../../../../../../../player/player";
import { CycleEnemyBody } from "../../body";
import { CycleEnemyMachine } from "../machine";
import { MeleeAttackingState } from "./melee-attacking";
import { CycleEnemyState } from "./state";

export class AttackingRunningState extends CycleEnemyState {
  public constructor(public machine: CycleEnemyMachine) {
    super(machine);

    const meleeAttackingTransition = (machine: CycleEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;

      if (avatar && movement && playerInWorld) {
        const cycleEnemyBody = machine.enemy.getComponent<CycleEnemyBody>("body");

        if (cycleEnemyBody.groundSensorsContact.size === 0) return;

        const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
        const playerPosition = playerBody.body.getPosition();

        const cycleEnemyPosition = cycleEnemyBody.body.getPosition();

        const playerToCycleEnemyDistance = Vec2.distance(playerPosition, cycleEnemyPosition);

        const minDistanceToPlayerForAttackingRunning = enemies.cycleEnemy.minDistanceToPlayerForMeleeAttack;
        if (playerToCycleEnemyDistance < minDistanceToPlayerForAttackingRunning) {
          this.machine.state = new MeleeAttackingState(machine);
          this.machine.state.enter();
          return true;
        }
      }
    };

    this.transitions.set("meleeAttacking", meleeAttackingTransition);
  }

  enter() {
    if (enemies.cycleEnemy.isLogStateChanges) console.log('%cEnemy ' + this.machine.enemy.name + ' %centered state: ' + 'AttackingRunningState', enemies.cycleEnemy.logColor, logColors.state);

    this.machine.avatar.avatar.play("cycle-attacking-running");
  }

  update() {
    if (playerInWorld && !this.machine.movement.knockBack) {
      const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();

      const cycleEnemyBody =
        this.machine.enemy.getComponent<CycleEnemyBody>("body");

      const cycleEnemyBodyBody = cycleEnemyBody.body;
      const cycleEnemyPosition = cycleEnemyBodyBody.getPosition();

      const playerToCycleEnemyDistance = Vec2.distance(
        playerPosition,
        cycleEnemyPosition
      );

      const bodyVelocity = cycleEnemyBodyBody.getLinearVelocity();

      const xMoveDir = playerPosition.x < cycleEnemyPosition.x ? -1 : 1;

      cycleEnemyBodyBody.setLinearVelocity(
        Vec2(xMoveDir * this.machine.movement.moveSpeed, bodyVelocity.y)
      );
    }

    super.update();
  }
}

import { Vec2 } from "planck-js";
import { enemies, logColors } from "../../../../../../../../helpers/vars";
import { PlayerBody } from "../../../../../../../player/components/body";
import { playerInWorld } from "../../../../../../../player/player";
import { OceanEnemy } from "../../../ocean-enemy";
import { animationNames, OceanEnemyAvatar } from "../../avatar";
import { OceanEnemyBody } from "../../body";
import { OceanEnemyMachine } from "../machine";
import { AttackState } from "./attack";
import { IdleState } from "./idle";
import { OceanEnemyState } from "./state";

export class ChasingState extends OceanEnemyState {
	public constructor(public machine: OceanEnemyMachine) {
		super(machine);
		const attackTransition = (machine: OceanEnemyMachine) => {
			const avatar = this.machine.avatar;
			const movement = this.machine.movement;

			if (avatar && movement && playerInWorld) {
				const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
				const playerPosition = playerBody.body.getPosition();

				const oceanEnemyBody = machine.enemy.getComponent<OceanEnemyBody>("body");
				const oceanEnemyPosition = oceanEnemyBody.body.getPosition();

				const playerToOceanEnemyDistance = Vec2.distance(playerPosition, oceanEnemyPosition);

        const minDistanceToPlayerForAttack = enemies.oceanEnemy.minDistanceToPlayerForAttack_enemy;
				if(playerToOceanEnemyDistance < minDistanceToPlayerForAttack) {
					this.machine.state = new AttackState(machine);
					this.machine.state.enter();
					return true;
				}
			}
		};

    const knockBackTransition = (machine: OceanEnemyMachine) => {
      if (this.machine.movement.knockBack) {
        machine.state = new IdleState(machine);
        machine.state.enter();
        return true;
      }
    };

    const deadTransition = (machine: OceanEnemyMachine) => {
      if (this.machine.oceanEnemy.life <= 0) {
        machine.state = new IdleState(machine);
        machine.state.enter();
        return true;
      }
    };

    const idleTransition = (machine: OceanEnemyMachine) => {
      const player = playerInWorld;
      const playerBody = player.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();

      const oceanEnemyBody =
      machine.enemy.getComponent<OceanEnemyBody>("body");
      const oceanEnemyPosition = oceanEnemyBody.body.getPosition();

      const playerToSickEnemyDistance = Vec2.distance(playerPosition, oceanEnemyPosition);

      const minDistanceToPlayerForChasing = enemies.oceanEnemy.minDistanceToPlayerForChasing_enemy;
      if(playerToSickEnemyDistance > minDistanceToPlayerForChasing) {
        machine.state = new IdleState(machine);
        machine.state.enter();
        return true;
      }
    };

    this.transitions.set("dead", deadTransition);
    this.transitions.set("knockBackTransition", knockBackTransition);
		this.transitions.set("attack", attackTransition);
	}
	enter() {
		if(enemies.oceanEnemy.isLogStateChanges) console.log('%cEnemy ' + this.machine.enemy.name + ' %centered state: ' + 'ChasingState' , enemies.oceanEnemy.logColor, logColors.state);

    const avatar = this.machine.avatar as OceanEnemyAvatar;
    avatar.playAnimation(animationNames.WALK);
	}
	update() {
		if (playerInWorld && !this.machine.movement.knockBack) {
      const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();

      const oceanEnemyBody =
        this.machine.oceanEnemy.getComponent<OceanEnemyBody>("body");

      const oceanEnemyBodyBody = oceanEnemyBody.body;
      const oceanEnemyPosition = oceanEnemyBodyBody.getPosition();

      const playerToOceanEnemyDistance = Vec2.distance(
        playerPosition,
        oceanEnemyPosition
      );

      const bodyVelocity = oceanEnemyBodyBody.getLinearVelocity();

      const xMoveDir = playerPosition.x < oceanEnemyPosition.x ? -1 : 1;

      oceanEnemyBodyBody.setLinearVelocity(
        Vec2(xMoveDir * this.machine.movement.moveSpeed, bodyVelocity.y)
      );
    }

		super.update();
	}
}

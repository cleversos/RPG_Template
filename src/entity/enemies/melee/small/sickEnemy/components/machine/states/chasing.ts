import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { PlayerBody } from "../../../../../../../player/components/body";
import { playerInWorld } from "../../../../../../../player/player";
import { SickEnemyAvatar } from "../../avatar";
import { SickEnemyBody } from "../../body";
import { SickEnemyMachine } from "../machine";
import { AttackState } from "./attack";
import { IdleState } from "./idle";
import { SickEnemyState } from "./state";

export class ChasingState extends SickEnemyState {
	public constructor(public machine: SickEnemyMachine) {
		super(machine);

		const attackTransition = (machine: SickEnemyMachine) => {
			const avatar = this.machine.avatar;
			const movement = this.machine.movement;

			if (avatar && movement && playerInWorld) {
				const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
				const playerPosition = playerBody.body.getPosition();

				const sickEnemyBody = machine.enemy.getComponent<SickEnemyBody>("body");
				const sickEnemyPosition = sickEnemyBody.body.getPosition();

				const playerToSickEnemyDistance = Vec2.distance(playerPosition, sickEnemyPosition);

        const minDistanceToPlayerForAttack = enemies.sickEnemy.minDistanceToPlayerForAttack_enemy;
				if(playerToSickEnemyDistance < minDistanceToPlayerForAttack) {
					this.machine.state = new AttackState(machine);
					this.machine.state.enter();
					return true;
				}
			}
		};

    const knockBackTransition = (machine: SickEnemyMachine) => {
      if (this.machine.movement.knockBack) {
        machine.state = new IdleState(machine);
        machine.state.enter();
        return true;
      }
    };

    const deadTransition = (machine: SickEnemyMachine) => {
      if (this.machine.enemy.life <= 0) {
        machine.state = new IdleState(machine);
        machine.state.enter();
        return true;
      }
    };

    const idleTransition = (machine: SickEnemyMachine) => {
      const player = playerInWorld;
      const playerBody = player.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();

      const sickEnemyBody =
      machine.enemy.getComponent<SickEnemyBody>("body");
      const sickEnemyPosition = sickEnemyBody.body.getPosition();

      const playerToSickEnemyDistance = Vec2.distance(playerPosition, sickEnemyPosition);

      const minDistanceToPlayerForChasing = enemies.sickEnemy.minDistanceToPlayerForChasing_enemy;
      if(playerToSickEnemyDistance > minDistanceToPlayerForChasing) {
        machine.state = new IdleState(machine);
        machine.state.enter();
        return true;
      }
    };

    this.transitions.set("dead", deadTransition);
    this.transitions.set("knockBackTransition", knockBackTransition);
		this.transitions.set("idle", idleTransition);
		this.transitions.set("attack", attackTransition);
	}
	enter() {
		const sickEnemyAvatar =
				this.machine.enemy.getComponent<SickEnemyAvatar>("avatar");
		sickEnemyAvatar.avatar.play("sick-walk");
	}
	update() {
		if (playerInWorld && !this.machine.movement.knockBack) {
      const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();

      const sickEnemyBody =
        this.machine.enemy.getComponent<SickEnemyBody>("body");

      const sickEnemyBodyBody = sickEnemyBody.body;
      const sickEnemyPosition = sickEnemyBodyBody.getPosition();

      const playerToSickEnemyDistance = Vec2.distance(
        playerPosition,
        sickEnemyPosition
      );

      const bodyVelocity = sickEnemyBodyBody.getLinearVelocity();

      const xMoveDir = playerPosition.x < sickEnemyPosition.x ? -1 : 1;

      sickEnemyBodyBody.setLinearVelocity(
        Vec2(xMoveDir * this.machine.movement.moveSpeed, bodyVelocity.y)
      );

    }

		super.update();
	}
}

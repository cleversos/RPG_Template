import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { PlayerBody } from "../../../../../../../player/components/body";
import { playerInWorld } from "../../../../../../../player/player";
import { NightEnemyAvatar } from "../../avatar";
import { NightEnemyBody } from "../../body";
import { NightEnemyMachine } from "../machine";
import { AttackState } from "./attack";
import { IdleState } from "./idle";
import { DeadState } from "./dead";
import { NightEnemyState } from "./state";

export class ChasingState extends NightEnemyState {
	public constructor(public machine: NightEnemyMachine) {
		super(machine);

		const attackTransition = (machine: NightEnemyMachine) => {
			const avatar = this.machine.avatar;
			const movement = this.machine.movement;

			if (avatar && movement && playerInWorld) {
				const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
				const playerPosition = playerBody.body.getPosition();

				const nightEnemyBody = machine.enemy.getComponent<NightEnemyBody>("body");
				const nightEnemyPosition = nightEnemyBody.body.getPosition();

				const playerToNightEnemyDistance = Vec2.distance(playerPosition, nightEnemyPosition);

        const minDistanceToPlayerForAttack = enemies.nightEnemy.minDistanceToPlayerForAttack_enemy;
				if(playerToNightEnemyDistance < minDistanceToPlayerForAttack) {
					this.machine.state = new AttackState(machine);
					this.machine.state.enter();
					return true;
				}
			}
		};

    const knockBackTransition = (machine: NightEnemyMachine) => {
      if (this.machine.movement.knockBack) {
        machine.state = new IdleState(machine);
        machine.state.enter();
        return true;
      }
    };

    const deadTransition = (machine: NightEnemyMachine) => {
      if (this.machine.enemy.dead) {
        machine.state = new DeadState(machine);
        machine.state.enter();
        return true;
      }
    };

    const idleTransition = (machine: NightEnemyMachine) => {
      const player = playerInWorld;
      const playerBody = player.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();

      const nightEnemyBody =
      machine.enemy.getComponent<NightEnemyBody>("body");
      const nightEnemyPosition = nightEnemyBody.body.getPosition();

      const playerToNightEnemyDistance = Vec2.distance(playerPosition, nightEnemyPosition);

      const minDistanceToPlayerForChasing = enemies.nightEnemy.minDistanceToPlayerForChasing_enemy;
      if(playerToNightEnemyDistance > minDistanceToPlayerForChasing) {
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
		const nightEnemyAvatar =
				this.machine.enemy.getComponent<NightEnemyAvatar>("avatar");
		nightEnemyAvatar.avatar.play("night-walk");
	}
	update() {
		if (playerInWorld && !this.machine.movement.knockBack) {
      const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();

      const nightEnemyBody =
        this.machine.enemy.getComponent<NightEnemyBody>("body");

      const nightEnemyBodyBody = nightEnemyBody.body;
      const nightEnemyPosition = nightEnemyBodyBody.getPosition();

      const playerToNightEnemyDistance = Vec2.distance(
        playerPosition,
        nightEnemyPosition
      );

      const bodyVelocity = nightEnemyBodyBody.getLinearVelocity();

      const xMoveDir = playerPosition.x < nightEnemyPosition.x ? -1 : 1;

      nightEnemyBodyBody.setLinearVelocity(
        Vec2(xMoveDir * this.machine.movement.moveSpeed, bodyVelocity.y)
      );

    }

    const nightEnemyBody =
    this.machine.enemy.getComponent<NightEnemyBody>("body");

    if (this.machine.enemy.life <= 0 && !this.machine.enemy.dead && !this.machine.movement.knockBack && nightEnemyBody.landed) {
      const night = this.machine.enemy;
      const scene = night.scene;
      const container = night.container;
      const nightEnemyBody =
      night.getComponent<NightEnemyBody>("body");
      nightEnemyBody.dead();
      night.dead = true;
    }

		super.update();
	}
}

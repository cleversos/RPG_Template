import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { PlayerBody } from "../../../../../../../player/components/body";
import { playerInWorld } from "../../../../../../../player/player";
import { EggEnemy } from "../../../egg-enemy";
import { EggEnemyAvatar } from "../../avatar";
import { EggEnemyBody } from "../../body";
import { EggEnemyMachine } from "../machine";
import { AttackState } from "./attack";
import { IdleState } from "./idle";
import { EggEnemyState } from "./state";

export class ChasingState extends EggEnemyState {
	public constructor(public machine: EggEnemyMachine) {
		super(machine);
		const attackTransition = (machine: EggEnemyMachine) => {
			const avatar = this.machine.avatar;
			const movement = this.machine.movement;

			if (avatar && movement && playerInWorld) {
				const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
				const playerPosition = playerBody.body.getPosition();

				const eggEnemyBody = machine.enemy.getComponent<EggEnemyBody>("body");
				const eggEnemyPosition = eggEnemyBody.body.getPosition();

				const playerToEggEnemyDistance = Vec2.distance(playerPosition, eggEnemyPosition);

        const minDistanceToPlayerForAttack = this.machine.eggEnemy.isSmall ? enemies.eggEnemy.minDistanceToPlayerForAttack_smallEnemy : enemies.eggEnemy.minDistanceToPlayerForAttack_largeEnemy;
				if(playerToEggEnemyDistance < minDistanceToPlayerForAttack) {
					this.machine.state = new AttackState(machine);
					this.machine.state.enter();
					return true;
				}
			}
		};

    const knockBackTransition = (machine: EggEnemyMachine) => {
      if (this.machine.movement.knockBack) {
        machine.state = new IdleState(machine);
        machine.state.enter();
        return true;
      }
    };

    const deadTransition = (machine: EggEnemyMachine) => {
      if (this.machine.eggEnemy.life <= 0) {
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
		// console.log(this.machine.eggEnemy.name + " entered ChasingState");

		const eggEnemyAvatar =
				this.machine.eggEnemy.getComponent<EggEnemyAvatar>("avatar");
		eggEnemyAvatar.avatar.play("egg-thrower-avoid");
	}
	update() {
		if (playerInWorld && !this.machine.movement.knockBack) {
      const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();

      const eggEnemyBody =
        this.machine.eggEnemy.getComponent<EggEnemyBody>("body");

      const eggEnemyBodyBody = eggEnemyBody.body;
      const eggEnemyPosition = eggEnemyBodyBody.getPosition();

      const playerToEggEnemyDistance = Vec2.distance(
        playerPosition,
        eggEnemyPosition
      );

      const bodyVelocity = eggEnemyBodyBody.getLinearVelocity();

      const xMoveDir = playerPosition.x < eggEnemyPosition.x ? -1 : 1;

      const sameDirSensorTaken = this.isMoveDirectionSameAsSmallEggEnemySideSensorTaken(xMoveDir, eggEnemyBody);
      if(sameDirSensorTaken) {
        eggEnemyBodyBody.setLinearVelocity(
          Vec2(0, 0)
        );
      } else {
        eggEnemyBodyBody.setLinearVelocity(
          Vec2(xMoveDir * this.machine.movement.moveSpeed, bodyVelocity.y)
        );
      }
    }

		super.update();
	}

  isMoveDirectionSameAsSmallEggEnemySideSensorTaken(xMoveDir: number, eggEnemyBody: EggEnemyBody) {
    if(xMoveDir === -1 && eggEnemyBody.isLeftSmallEggEnemySensorTouching) return true;
    if(xMoveDir === 1 && eggEnemyBody.isRightSmallEggEnemySensorTouching) return true;

    return false;
  }
}

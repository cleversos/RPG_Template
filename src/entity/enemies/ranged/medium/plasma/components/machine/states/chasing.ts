import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { PlayerBody } from "../../../../../../../player/components/body";
import { playerInWorld } from "../../../../../../../player/player";
import { PlasmaEnemyAvatar, plasma_animationNames } from "../../avatar";
import { PlasmaEnemyBody } from "../../body";
import { PlasmaEnemyMovement } from "../../movement";
import { PlasmaEnemyMachine } from "../machine";
import { AttackState } from "./attack";
import { DeadState } from "./dead";
import { IdleState } from "./idle";
import { PlasmaEnemyState } from "./state";

export class ChasingState extends PlasmaEnemyState {
  public constructor(public machine: PlasmaEnemyMachine) {
    super(machine);
    const attackTransition = (machine: PlasmaEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;

      if (avatar && movement && playerInWorld) {
        const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
        const playerPosition = playerBody.body.getPosition();

        const body = machine.enemy.getComponent<PlasmaEnemyBody>("body");
        const enemyPosition = body.body.getPosition();

        const playerToEnemyDistance = Vec2.distance(playerPosition, enemyPosition);

        const movement =
          machine.enemy.getComponent<PlasmaEnemyMovement>("movement");

        const minDistanceToPlayerForAttack = movement.minDistanceToPlayerForAttack;
        if (playerToEnemyDistance < minDistanceToPlayerForAttack) {
          this.machine.state = new AttackState(machine);
          this.machine.state.enter();
          return true;
        }
      }
    };

    const knockBackTransition = (machine: PlasmaEnemyMachine) => {
      if (this.machine.movement.knockBack) {
        machine.state = new IdleState(machine);
        machine.state.enter();
        return true;
      }
    };

    const deadTransition = (machine: PlasmaEnemyMachine) => {
      if (this.machine.enemy.life <= 0) {
        machine.state = new DeadState(machine);
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

    const avatar =
      this.machine.enemy.getComponent<PlasmaEnemyAvatar>("avatar");
    avatar.playAnimation(plasma_animationNames.RUN);
    avatar.setStateText("CHASING", "#ffff00");
  }
  update() {
    if (playerInWorld && !this.machine.movement.knockBack) {
      const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();

      const body =
        this.machine.enemy.getComponent<PlasmaEnemyBody>("body");

      const position = body.body.getPosition();

      const bodyVelocity = body.body.getLinearVelocity();

      const xMoveDir = playerPosition.x < position.x ? -1 : 1;

      body.body.setLinearVelocity(
        Vec2(xMoveDir * this.machine.movement.moveSpeed, bodyVelocity.y)
      );
    }

    super.update();
  }
}

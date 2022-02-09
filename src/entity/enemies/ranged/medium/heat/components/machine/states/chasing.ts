import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { PlayerBody } from "../../../../../../../player/components/body";
import { playerInWorld } from "../../../../../../../player/player";
import { HeatEnemyAvatar, heat_animationNames } from "../../avatar";
import { HeatEnemyBody } from "../../body";
import { HeatEnemyMovement } from "../../movement";
import { HeatEnemyMachine } from "../machine";
import { AttackState } from "./attack";
import { DeadState } from "./dead";
import { IdleState } from "./idle";
import { HeatEnemyState } from "./state";

export class ChasingState extends HeatEnemyState {
  public constructor(public machine: HeatEnemyMachine) {
    super(machine);
    const attackTransition = (machine: HeatEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;

      if (avatar && movement && playerInWorld) {
        const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
        const playerPosition = playerBody.body.getPosition();

        const body = machine.enemy.getComponent<HeatEnemyBody>("body");
        const enemyPosition = body.body.getPosition();

        const playerToEnemyDistance = Vec2.distance(playerPosition, enemyPosition);

        const movement =
          machine.enemy.getComponent<HeatEnemyMovement>("movement");

        const minDistanceToPlayerForAttack = movement.minDistanceToPlayerForAttack;
        if (playerToEnemyDistance < minDistanceToPlayerForAttack) {
          this.machine.state = new AttackState(machine);
          this.machine.state.enter();
          return true;
        }
      }
    };

    const knockBackTransition = (machine: HeatEnemyMachine) => {
      if (this.machine.movement.knockBack) {
        machine.state = new IdleState(machine);
        machine.state.enter();
        return true;
      }
    };

    const deadTransition = (machine: HeatEnemyMachine) => {
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
      this.machine.enemy.getComponent<HeatEnemyAvatar>("avatar");
    avatar.playAnimation(heat_animationNames.RUN);
    avatar.setStateText("CHASING", "#ffff00");
  }
  update() {
    if (playerInWorld && !this.machine.movement.knockBack) {
      const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();

      const body =
        this.machine.enemy.getComponent<HeatEnemyBody>("body");

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

import { playerInWorld } from "../../../../../../../player/player";
import { PlayerBody } from "../../../../../../../player/components/body";
import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { ChasingState } from "./chasing";
import { IdleState } from "./idle";
import { PlanckPhaserAdapter } from "../../../../../../../../physic/planck-phaser-adapter";
import { PlayerMovement } from "../../../../../../../player/components/movement";
import { GameCore } from "../../../../../../../../core/game";
import { HeatEnemyState } from "./state";
import { HeatEnemyMachine } from "../machine";
import { HeatEnemyBody } from "../../body";
import { HeatEnemyAvatar, heat_animationNames } from "../../avatar";
import { EggProjectile } from "../../../../../../melee/small/eggProjectile/egg-projectile";
import { LavaProjectile } from "../../../../../../melee/small/lavaProjectile/lava-projectile";
import { HeatEnemy } from "../../../heat-enemy";
import { HeatEnemyMovement } from "../../movement";
import { DeadState } from "./dead";

const adapter = PlanckPhaserAdapter;

export class AttackState extends HeatEnemyState {
  private current_timeBeforeThrowLava_ms = 0;
  private canAttack = true;
  private target_timeBeforeThrowLava_ms: number; // this is calculated based on the frame rate of the attack animation

  public constructor(public machine: HeatEnemyMachine) {
    super(machine);

    const chaseTransition = (machine: HeatEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;

      if (avatar && movement && playerInWorld) {
        const playerBody =
          playerInWorld.getComponent<PlayerBody>("player-body");
        const playerPosition = playerBody.body.getPosition();

        const body =
          machine.enemy.getComponent<HeatEnemyBody>("body");
        const eggEnemyPosition = body.body.getPosition();

        const playerToEggEnemyDistance = Vec2.distance(
          playerPosition,
          eggEnemyPosition
        );

        const movement =
          machine.enemy.getComponent<HeatEnemyMovement>("movement");

        const minDistanceToPlayerForAttack = movement.minDistanceToPlayerForAttack;
        if (playerToEggEnemyDistance > minDistanceToPlayerForAttack) {
          this.machine.state = new ChasingState(machine);
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
    this.transitions.set("chase", chaseTransition);
  }
  enter() {
    // console.log(this.machine.eggEnemy.name + " entered AttackState");

    this.calculateTargetTimeBeforeLavaThrow();

    const avatar =
      this.machine.enemy.getComponent<HeatEnemyAvatar>("avatar");
    avatar.playAnimation(heat_animationNames.ATTACK);
    avatar.setStateText("ATTACKING", "#ff0000");

    this.machine.avatar.avatar.on("animationrepeat", () => {
      this.canAttack = true;
    });
  }

  update() {
    if (
      !this.machine.movement.knockBack &&
      !document.hidden &&
      window.document.hasFocus()
    ) {
      this.incrementThrowTimer();
    }

    super.update();
  }

  calculateTargetTimeBeforeLavaThrow() {
    const msForOneFrame = 1000 / 30; // 30 is the frame rate for the animation
    const attackFrame = 17; // if you look at the images in the animation, this is the frame number when the enemy is extended
    this.target_timeBeforeThrowLava_ms = 1500;
  }

  incrementThrowTimer() {
    if (this.canAttack) {
      this.current_timeBeforeThrowLava_ms += adapter.deltaTime;
    }

    // console.log(this.current_timeBeforeThrowLava_ms, this.target_timeBeforeThrowLava_ms, this.canAttack, adapter.deltaTime);
    if (
      this.current_timeBeforeThrowLava_ms >= this.target_timeBeforeThrowLava_ms &&
      this.canAttack
    ) {
      this.current_timeBeforeThrowLava_ms = 0;
      this.canAttack = false;
      const playerBody =
        playerInWorld.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();
      const enemyBody =
        this.machine.enemy.getComponent<HeatEnemyBody>("body");
      const enemyBodyPosition = enemyBody.body.getPosition();
      new LavaProjectile(
        this.machine.enemy.container.x,
        this.machine.enemy.container.y - 50,
        enemyBodyPosition.x > playerPosition.x ? -1 : 1,
        this.machine.enemy.scene
      );
    }
  }
}

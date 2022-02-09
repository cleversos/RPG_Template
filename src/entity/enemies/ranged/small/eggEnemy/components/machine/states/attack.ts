import { EggEnemyMachine } from "../machine";
import { EggEnemyState } from "./state";
import { EggEnemyAvatar } from "../../avatar";
import { playerInWorld } from "../../../../../../../player/player";
import { PlayerBody } from "../../../../../../../player/components/body";
import { EggEnemyBody } from "../../body";
import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { ChasingState } from "./chasing";
import { IdleState } from "./idle";
import { EggProjectile } from "../../../../../../melee/small/eggProjectile/egg-projectile";
import { PlanckPhaserAdapter } from "../../../../../../../../physic/planck-phaser-adapter";
import { PlayerMovement } from "../../../../../../../player/components/movement";
import { GameCore } from "../../../../../../../../core/game";

const adapter = PlanckPhaserAdapter;

export class AttackState extends EggEnemyState {
  private current_timeBeforeThrowEgg = 0;
  private current_timeBeforeMeleeAttack = 0;
  private canAttack = true;
  private target_timeBeforeEggThrow: number; // this is calculated based on the frame rate of the attack animation

  public constructor(public machine: EggEnemyMachine) {
    super(machine);

    const chaseTransition = (machine: EggEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;

      if (avatar && movement && playerInWorld) {
        const playerBody =
          playerInWorld.getComponent<PlayerBody>("player-body");
        const playerPosition = playerBody.body.getPosition();

        const eggEnemyBody =
          machine.eggEnemy.getComponent<EggEnemyBody>("body");
        const eggEnemyPosition = eggEnemyBody.body.getPosition();

        const playerToEggEnemyDistance = Vec2.distance(
          playerPosition,
          eggEnemyPosition
        );

        const minDistanceToPlayerForAttack = this.machine.eggEnemy.isSmall
          ? enemies.eggEnemy.minDistanceToPlayerForAttack_smallEnemy
          : enemies.eggEnemy.minDistanceToPlayerForAttack_largeEnemy;
        if (playerToEggEnemyDistance > minDistanceToPlayerForAttack) {
          this.machine.state = new ChasingState(machine);
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
    if (this.machine.eggEnemy.isSmall) {
      this.transitions.set("chase", chaseTransition);
    }
  }
  enter() {
    // console.log(this.machine.eggEnemy.name + " entered AttackState");

    this.calculateTargetTimeBeforeEggThrow();

    this.machine.avatar.avatar.play("egg-thrower-attack");

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

  calculateTargetTimeBeforeEggThrow() {
    const msForOneFrame = 1000 / enemies.eggEnemy.attackFrameRate;
    const attackFrame = 52; // if you look at the images in the animation, frame 52 is when the egg thrower is extended
    this.target_timeBeforeEggThrow = msForOneFrame * attackFrame;
  }

  incrementThrowTimer() {
    if (this.machine.eggEnemy.isSmall) {
      if (this.canAttack) {
        this.current_timeBeforeMeleeAttack += adapter.deltaTime;
      }

      if (
        this.current_timeBeforeMeleeAttack >= this.target_timeBeforeEggThrow &&
        this.canAttack
      ) {
        this.current_timeBeforeMeleeAttack = 0;
        this.canAttack = false;
        const player = playerInWorld;
        const movement = player.getComponent<PlayerMovement>("player-movement");
        const knockbackDirection = player.x < this.machine.eggEnemy.x ? -1 : 1;
        if (!movement.preventKnockBack) GameCore.heart -= 1;
        movement.knockback(knockbackDirection);
      }
    } else {
      // only increment if enemy can attack (waiting from attack animation to finish)
      if (this.canAttack) {
        this.current_timeBeforeThrowEgg += adapter.deltaTime;
      }

      if (
        this.current_timeBeforeThrowEgg >= this.target_timeBeforeEggThrow &&
        this.canAttack
      ) {
        this.current_timeBeforeThrowEgg = 0;
        this.canAttack = false;
        const playerBody =
          playerInWorld.getComponent<PlayerBody>("player-body");
        const playerPosition = playerBody.body.getPosition();
        const eggEnemyBody =
          this.machine.eggEnemy.getComponent<EggEnemyBody>("body");
        const eggEnemyBodyBody = eggEnemyBody.body;
        const eggEnemyPosition = eggEnemyBodyBody.getPosition();
        new EggProjectile(
          this.machine.eggEnemy.container.x,
          this.machine.eggEnemy.container.y,
          eggEnemyPosition.x > playerPosition.x ? -1 : 1,
          this.machine.eggEnemy.scene
        );
      }
    }
  }
}

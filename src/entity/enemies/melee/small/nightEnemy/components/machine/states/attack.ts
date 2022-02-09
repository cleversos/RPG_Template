import { NightEnemyMachine } from "../machine";
import { NightEnemyState } from "./state";
import { NightEnemyAvatar } from "../../avatar";
import { playerInWorld } from "../../../../../../../player/player";
import { PlayerBody } from "../../../../../../../player/components/body";
import { NightEnemyBody } from "../../body";
import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { ChasingState } from "./chasing";
import { IdleState } from "./idle";
import { DeadState } from "./dead";
import { PlanckPhaserAdapter } from "../../../../../../../../physic/planck-phaser-adapter";
import { PlayerMovement } from "../../../../../../../player/components/movement";
import { GameCore } from "../../../../../../../../core/game";

const adapter = PlanckPhaserAdapter;

export class AttackState extends NightEnemyState {
  private current_timeBeforeThrowNight = 0;
  private current_timeBeforeMeleeAttack = 0;
  private canAttack = true;
  private target_timeBeforeNightAttack: number; // this is calculated based on the frame rate of the attack animation

  public constructor(public machine: NightEnemyMachine) {
    super(machine);

    const chaseTransition = (machine: NightEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;

      if (avatar && movement && playerInWorld) {
        const playerBody =
          playerInWorld.getComponent<PlayerBody>("player-body");
        const playerPosition = playerBody.body.getPosition();

        const nightEnemyBody =
          machine.enemy.getComponent<NightEnemyBody>("body");
        const nightEnemyPosition = nightEnemyBody.body.getPosition();

        const playerToNightEnemyDistance = Vec2.distance(
          playerPosition,
          nightEnemyPosition
        );

        const minDistanceToPlayerForAttack =
          enemies.nightEnemy.minDistanceToPlayerForAttack_enemy;
        if (playerToNightEnemyDistance > minDistanceToPlayerForAttack) {
          this.machine.state = new ChasingState(machine);
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

    this.transitions.set("dead", deadTransition);
    this.transitions.set("knockBackTransition", knockBackTransition);
    this.transitions.set("chase", chaseTransition);
  }
  enter() {
    this.calculateTargetTimeBeforeNightThrow();

    this.machine.avatar.avatar.play("night-attack");

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
      this.attack();
    }

    if (
      this.machine.enemy.life <= 0 &&
      !this.machine.enemy.dead &&
      !this.machine.movement.knockBack
    ) {
      const night = this.machine.enemy;
      const scene = night.scene;
      const container = night.container;
      const nightEnemyBody = night.getComponent<NightEnemyBody>("body");
      nightEnemyBody.dead();
      night.dead = true;
    }

    super.update();
  }

  calculateTargetTimeBeforeNightThrow() {
    const msForOneFrame = 1000 / enemies.nightEnemy.attackFrameRate;
    const attackFrame = 52; // if you look at the images in the animation, frame 52 is when the night thrower is extended
    this.target_timeBeforeNightAttack = msForOneFrame * attackFrame;
  }

  attack() {
    if (this.canAttack) {
      this.current_timeBeforeMeleeAttack += adapter.deltaTime;
    }

    if (this.canAttack) {
      this.current_timeBeforeMeleeAttack += adapter.deltaTime;
    }

    if (
      this.current_timeBeforeMeleeAttack >= this.target_timeBeforeNightAttack &&
      this.canAttack
    ) {
      this.current_timeBeforeMeleeAttack = 0;
      this.canAttack = false;
      const player = playerInWorld;
      const movement = player.getComponent<PlayerMovement>("player-movement");
      const knockbackDirection = player.x < this.machine.enemy.x ? -1 : 1;
      if (!movement.preventKnockBack) GameCore.heart -= 1;
      movement.knockback(knockbackDirection);
    }
  }
}

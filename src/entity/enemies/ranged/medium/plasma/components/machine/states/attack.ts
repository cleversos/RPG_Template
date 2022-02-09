import { playerInWorld } from "../../../../../../../player/player";
import { PlayerBody } from "../../../../../../../player/components/body";
import { Vec2 } from "planck-js";
import { ChasingState } from "./chasing";
import { IdleState } from "./idle";
import { PlanckPhaserAdapter } from "../../../../../../../../physic/planck-phaser-adapter";
import { PlasmaEnemyState } from "./state";
import { PlasmaEnemyMachine } from "../machine";
import { PlasmaEnemyBody } from "../../body";
import { PlasmaEnemyAvatar, plasma_animationNames } from "../../avatar";
import { PlasmaEnemyMovement } from "../../movement";
import { DeadState } from "./dead";
import { PlasmaProjectile } from "../../../../../../melee/small/plasmaProjectile/plasma-projectile";

const adapter = PlanckPhaserAdapter;

export class AttackState extends PlasmaEnemyState {
  private current_timeBeforeThrowLava_ms = 0;
  private canAttack = true;
  private target_timeBeforeThrowLava_ms: number; // this is calculated based on the frame rate of the attack animation

  public constructor(public machine: PlasmaEnemyMachine) {
    super(machine);

    const chaseTransition = (machine: PlasmaEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;

      if (avatar && movement && playerInWorld) {
        const playerBody =
          playerInWorld.getComponent<PlayerBody>("player-body");
        const playerPosition = playerBody.body.getPosition();

        const body =
          machine.enemy.getComponent<PlasmaEnemyBody>("body");
        const eggEnemyPosition = body.body.getPosition();

        const playerToEggEnemyDistance = Vec2.distance(
          playerPosition,
          eggEnemyPosition
        );

        const movement =
          machine.enemy.getComponent<PlasmaEnemyMovement>("movement");

        const minDistanceToPlayerForAttack = movement.minDistanceToPlayerForAttack;
        if (playerToEggEnemyDistance > minDistanceToPlayerForAttack) {
          this.machine.state = new ChasingState(machine);
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
    this.transitions.set("chase", chaseTransition);
  }
  enter() {
    // console.log(this.machine.eggEnemy.name + " entered AttackState");

    this.calculateTargetTimeBeforeLavaThrow();

    const avatar =
      this.machine.enemy.getComponent<PlasmaEnemyAvatar>("avatar");
    avatar.playAnimation(plasma_animationNames.ATTACK);
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
        this.machine.enemy.getComponent<PlasmaEnemyBody>("body");
      const enemyBodyPosition = enemyBody.body.getPosition();
      new PlasmaProjectile(
        this.machine.enemy.container.x,
        this.machine.enemy.container.y - 50,
        enemyBodyPosition.x > playerPosition.x ? -1 : 1,
        this.machine.enemy.scene
      );
    }
  }
}

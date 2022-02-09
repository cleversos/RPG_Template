import { SickEnemyMachine } from "../machine";
import { SickEnemyState } from "./state";
import { SickEnemyAvatar } from "../../avatar";
import { playerInWorld } from "../../../../../../../player/player";
import { PlayerBody } from "../../../../../../../player/components/body";
import { SickEnemyBody } from "../../body";
import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { ChasingState } from "./chasing";
import { IdleState } from "./idle";
import { PlanckPhaserAdapter } from "../../../../../../../../physic/planck-phaser-adapter";
import { PlayerMovement } from "../../../../../../../player/components/movement";

const adapter = PlanckPhaserAdapter;

export class AttackState extends SickEnemyState {
  private current_timeBeforeThrowSick = 0;
  private current_timeBeforeMeleeAttack = 0;
  private canAttack = true;
  private target_timeBeforeSickThrow: number; // this is calculated based on the frame rate of the attack animation

  public constructor(public machine: SickEnemyMachine) {
    super(machine);

    const chaseTransition = (machine: SickEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;

      if (avatar && movement && playerInWorld) {
        const playerBody =
          playerInWorld.getComponent<PlayerBody>("player-body");
        const playerPosition = playerBody.body.getPosition();

        const sickEnemyBody =
          machine.enemy.getComponent<SickEnemyBody>("body");
        const sickEnemyPosition = sickEnemyBody.body.getPosition();

        const playerToSickEnemyDistance = Vec2.distance(
          playerPosition,
          sickEnemyPosition
        );


        const minDistanceToPlayerForAttack = enemies.sickEnemy.minDistanceToPlayerForAttack_enemy;
        if (
          playerToSickEnemyDistance >
          minDistanceToPlayerForAttack
        ) {
          this.machine.state = new ChasingState(machine);
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

    this.transitions.set("dead", deadTransition);
    this.transitions.set("knockBackTransition", knockBackTransition);
    this.transitions.set("chase", chaseTransition);
  }
  enter() {
    this.calculateTargetTimeBeforeSickThrow();

    this.machine.avatar.avatar.play("sick-attack");

    this.machine.avatar.avatar.on(
      "animationrepeat",
      () => {
        this.canAttack = true;
      }
    );
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

  calculateTargetTimeBeforeSickThrow() {
    const msForOneFrame = 1000 / enemies.sickEnemy.attackFrameRate;
    const attackFrame = 52; // if you look at the images in the animation, frame 52 is when the sick thrower is extended
    this.target_timeBeforeSickThrow = msForOneFrame * attackFrame;
  }

  incrementThrowTimer() {
    // only increment if enemy can attack (waiting from attack animation to finish)
    if (this.canAttack) {
      this.current_timeBeforeThrowSick += adapter.deltaTime;
    }

    if (
      this.current_timeBeforeThrowSick >=
      this.target_timeBeforeSickThrow &&
      this.canAttack
    ) {
      this.current_timeBeforeThrowSick = 0;
      this.canAttack = false;
      const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();
      const sickEnemyBody =
        this.machine.enemy.getComponent<SickEnemyBody>("body");
      const sickEnemyBodyBody = sickEnemyBody.body;
      const sickEnemyPosition = sickEnemyBodyBody.getPosition();
    }
  }
}

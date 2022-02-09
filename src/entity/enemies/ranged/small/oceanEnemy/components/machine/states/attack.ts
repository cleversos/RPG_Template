import { OceanEnemyMachine } from "../machine";
import { OceanEnemyState } from "./state";
import { animationNames, OceanEnemyAvatar } from "../../avatar";
import { playerInWorld } from "../../../../../../../player/player";
import { PlayerBody } from "../../../../../../../player/components/body";
import { OceanEnemyBody } from "../../body";
import { Vec2 } from "planck-js";
import { enemies, logColors } from "../../../../../../../../helpers/vars";
import { ChasingState } from "./chasing";
import { IdleState } from "./idle";
import { BubbleEnemy } from "../../../../../../melee/small/bubbleEnemy/bubble-enemy";
import { PlanckPhaserAdapter } from "../../../../../../../../physic/planck-phaser-adapter";
import { PlayerMovement } from "../../../../../../../player/components/movement";
import { GameCore } from "../../../../../../../../core/game";
import { BubbleEnemyAvatar } from "../../../../../../melee/small/bubbleEnemy/components/avatar";
import { OceanEnemy } from "../../../ocean-enemy";

const adapter = PlanckPhaserAdapter;

export class AttackState extends OceanEnemyState {
  private current_timeBeforeThrowOcean = 0;
  private current_timeBeforeMeleeAttack = 0;
  private isAttacking = false;

  public constructor(public machine: OceanEnemyMachine) {
    super(machine);

    const chaseTransition = (machine: OceanEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;

      if (avatar && movement && playerInWorld) {
        const playerBody =
          playerInWorld.getComponent<PlayerBody>("player-body");
        const playerPosition = playerBody.body.getPosition();

        const oceanEnemyBody =
          machine.oceanEnemy.getComponent<OceanEnemyBody>("body");
        const oceanEnemyPosition = oceanEnemyBody.body.getPosition();

        const playerToOceanEnemyDistance = Vec2.distance(
          playerPosition,
          oceanEnemyPosition
        );

        const minDistanceToPlayerForAttack =
          enemies.oceanEnemy.minDistanceToPlayerForAttack_enemy;
        if (playerToOceanEnemyDistance > minDistanceToPlayerForAttack) {
          this.machine.state = new ChasingState(machine);
          this.machine.state.enter();
          return true;
        }
      }
    };

    const knockBackTransition = (machine: OceanEnemyMachine) => {
      if (this.machine.movement.knockBack) {
        machine.state = new IdleState(machine);
        machine.state.enter();
        return true;
      }
    };
    const deadTransition = (machine: OceanEnemyMachine) => {
      if (this.machine.oceanEnemy.life <= 0) {
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
    if (enemies.oceanEnemy.isLogStateChanges)
      console.log(
        "%cEnemy " +
          this.machine.enemy.name +
          " %centered state: " +
          "AttackState",
        enemies.oceanEnemy.logColor,
        logColors.state
      );

    const avatar = this.machine.avatar as OceanEnemyAvatar;
    avatar.playAnimation(animationNames.IDLE);

    this.machine.avatar.avatar.on("animationcomplete", () => {
      this.shootBubble();

      avatar.playAnimation(animationNames.IDLE);
      this.isAttacking = false;
    });
  }

  leave(): void {
    this.machine.avatar.avatar.off("animationcomplete"); // remove event 'animationcomplete' from avatar, or else it will stack endless upon re-entry of this state (AttackState)
  }

  update() {
    if (
      !this.machine.movement.knockBack &&
      !document.hidden &&
      window.document.hasFocus()
    ) {
      this.checkIfCanAttack();
    }

    super.update();
  }

  checkIfCanAttack() {
    if (this.isMaxBubbles()) return;
    if (this.isAttacking) return;

    this.isAttacking = true;

    const avatar = this.machine.avatar as OceanEnemyAvatar;
    avatar.playAnimation(animationNames.ATTACK);
  }

  isMaxBubbles() {
    const oceanEnemyBody =
      this.machine.oceanEnemy.getComponent<OceanEnemyBody>("body");
    const oceanEnemy = oceanEnemyBody.enemy as OceanEnemy;

    const _isMaxBubbles =
      oceanEnemy.currentBubblesActive >= enemies.oceanEnemy.maxBubblesActive;
    return _isMaxBubbles;
  }

  shootBubble() {
    const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
    const playerPosition = playerBody.body.getPosition();
    const oceanEnemyBody =
      this.machine.oceanEnemy.getComponent<OceanEnemyBody>("body");
    const oceanEnemyBodyBody = oceanEnemyBody.body;
    const oceanEnemyPosition = oceanEnemyBodyBody.getPosition();
    new BubbleEnemy(
      this.machine.oceanEnemy.container.x,
      this.machine.oceanEnemy.container.y,
      oceanEnemyPosition.x > playerPosition.x ? -1 : 1,
      this.machine.oceanEnemy.scene,
      this.machine.oceanEnemy
    );

    const oceanEnemy = oceanEnemyBody.enemy as OceanEnemy;
    oceanEnemy.modifyCurrentBubblesActive(+1);
  }
}

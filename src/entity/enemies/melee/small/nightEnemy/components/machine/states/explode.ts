import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { GameCore } from "../../../../../../../../core/game";
import { LetterSystem } from "../../../../../../../letter-system/letter-system";
import { playerInWorld } from "../../../../../../../player/player";
import { NightEnemyBody } from "../../body";
import { NightEnemyMachine } from "../machine";
import { NightEnemyAvatar } from "../../avatar";
import { ChasingState } from "./chasing";
import { NightEnemyState } from "./state";
import { PlayerBody } from "../../../../../../../player/components/body";
import { PlayerMovement } from "../../../../../../../player/components/movement";

export class ExplodeState extends NightEnemyState {
  public bAttacked: boolean = false;
  public constructor(public machine: NightEnemyMachine) {
    super(machine);
  }
  enter() {
    const nightEnemyAvatar =
      this.machine.enemy.getComponent<NightEnemyAvatar>("avatar");
    nightEnemyAvatar.avatar.setScale(enemies.nightEnemy.explosionSize);
    nightEnemyAvatar.avatar.setOrigin(
      0.5,
      1 - enemies.nightEnemy.explosionHeight
    );
    nightEnemyAvatar.avatar.play("night-explode");
    const night = this.machine.enemy;
    setTimeout(() => {
      night.destroy();
      GameCore.points += 100;
      LetterSystem.enemySpawned -= 1;
    }, 500);
  }
  update() {
    const avatar = this.machine.avatar;
    const movement = this.machine.movement;

    if (avatar && movement && playerInWorld) {
      const playerBody = playerInWorld.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();

      const nightEnemyBody =
        this.machine.enemy.getComponent<NightEnemyBody>("body");
      const nightEnemyPosition = nightEnemyBody.body.getPosition();

      const playerToNightEnemyDistance = Vec2.distance(
        playerPosition,
        nightEnemyPosition
      );

      const minDistanceToPlayerForAttack =
        enemies.nightEnemy.minDistanceToPlayerForAttack_enemy;
      if (
        playerToNightEnemyDistance <= minDistanceToPlayerForAttack &&
        !this.bAttacked
      ) {
        this.bAttacked = true;
        const player = playerInWorld;
        const movement = player.getComponent<PlayerMovement>("player-movement");
        const knockbackDirection = player.x < this.machine.enemy.x ? -1 : 1;
        if (!movement.preventKnockBack) movement.knockback(knockbackDirection);
      }
    }
    super.update();
  }
}

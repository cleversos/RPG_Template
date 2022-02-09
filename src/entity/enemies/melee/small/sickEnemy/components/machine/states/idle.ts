import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { GameCore } from "../../../../../../../../core/game";
import { LetterSystem } from "../../../../../../../letter-system/letter-system";
import { playerInWorld } from "../../../../../../../player/player";
import { SickEnemyBody } from "../../body";
import { SickEnemyMachine } from "../machine";
import { SickEnemyAvatar } from "../../avatar";
import { ChasingState } from "./chasing";
import { SickEnemyState } from "./state";
import { PlayerBody } from "../../../../../../../player/components/body";

export class IdleState extends SickEnemyState {
  public constructor(public machine: SickEnemyMachine) {
    super(machine);

    const chaseTransition = (machine: SickEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;
      const body =
        this.machine.enemy.getComponent<SickEnemyBody>("body");

      if (body.groundSensorsContact.size === 0) return;

      if (
        avatar &&
        movement &&
        playerInWorld &&
        !this.machine.movement.knockBack &&
        this.machine.enemy.life > 0
      ) {
        const player = playerInWorld;
        const playerBody = player.getComponent<PlayerBody>("player-body");
        const playerPosition = playerBody.body.getPosition();
  
        const sickEnemyBody =
        machine.enemy.getComponent<SickEnemyBody>("body");
        const sickEnemyPosition = sickEnemyBody.body.getPosition();
  
        const playerToSickEnemyDistance = Vec2.distance(playerPosition, sickEnemyPosition);
  
        const minDistanceToPlayerForChasing = enemies.sickEnemy.minDistanceToPlayerForChasing_enemy;
        if(playerToSickEnemyDistance < minDistanceToPlayerForChasing) {
          this.machine.state = new ChasingState(machine);
          this.machine.state.enter();
          return true;
        }
      }
    };

    this.transitions.set("chase", chaseTransition);
  }
  enter() {
      const sickEnemyAvatar =
          this.machine.enemy.getComponent<SickEnemyAvatar>("avatar");
      sickEnemyAvatar.avatar.play("sick-walk");
  }
  update() {
    if (this.machine.enemy.life <= 0 && !this.machine.enemy.dead) {
      const sick = this.machine.enemy;
      const scene = sick.scene;
      const container = sick.container;

      scene.tweens.add({
        targets: [container],
        alpha: 0,
        duration: 400,
        onComplete: () => {
          sick.destroy();
          GameCore.points += 100;
          LetterSystem.enemySpawned -= 1;
        },
      });
      sick.dead = true;
    }
    super.update();
  }
}

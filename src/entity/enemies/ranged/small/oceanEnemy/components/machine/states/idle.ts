import { Vec2 } from "planck-js";
import { GameCore } from "../../../../../../../../core/game";
import { enemies, logColors } from "../../../../../../../../helpers/vars";
import { LetterSystem } from "../../../../../../../letter-system/letter-system";
import { PlayerBody } from "../../../../../../../player/components/body";
import { playerInWorld } from "../../../../../../../player/player";
import { OceanEnemyBody } from "../../body";
import { OceanEnemyMachine } from "../machine";
import { ChasingState } from "./chasing";
import { OceanEnemyState } from "./state";

export class IdleState extends OceanEnemyState {
  public constructor(public machine: OceanEnemyMachine) {
    super(machine);

    const chaseTransition = (machine: OceanEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;
      const body =
        this.machine.enemy.getComponent<OceanEnemyBody>("body");

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
  
        const oceanEnemyBody =
        machine.enemy.getComponent<OceanEnemyBody>("body");
        const oceanEnemyPosition = oceanEnemyBody.body.getPosition();
  
        const playerToNightEnemyDistance = Vec2.distance(playerPosition, oceanEnemyPosition);
  
        const minDistanceToPlayerForChasing = enemies.oceanEnemy.minDistanceToPlayerForChasing_enemy;
        if(playerToNightEnemyDistance < minDistanceToPlayerForChasing) {
          this.machine.state = new ChasingState(machine);
          this.machine.state.enter();
          return true;
        }
      }
    };

    this.transitions.set("chase", chaseTransition);
  }
  enter() {
    if(enemies.oceanEnemy.isLogStateChanges) console.log('%cEnemy ' + this.machine.enemy.name + ' %centered state: ' + 'IdleState' , enemies.oceanEnemy.logColor, logColors.state);
  }
  update() {
    if (this.machine.enemy.life <= 0 && !this.machine.enemy.dead) {
      const ocean = this.machine.enemy;
      const scene = ocean.scene;
      const container = ocean.container;

      scene.tweens.add({
        targets: [container],
        alpha: 0,
        duration: 400,
        onComplete: () => {
          ocean.destroy();
          GameCore.points += 100;
          LetterSystem.enemySpawned -= 1;
        },
      });
      ocean.dead = true;
    }
    super.update();
  }
}

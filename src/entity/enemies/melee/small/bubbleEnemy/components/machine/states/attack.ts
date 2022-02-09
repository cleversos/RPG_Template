import { Vec2 } from "planck-js";
import { GameCore } from "../../../../../../../../core/game";
import { LetterSystem } from "../../../../../../../letter-system/letter-system";
import { PlayerBody } from "../../../../../../../player/components/body";
import { playerInWorld } from "../../../../../../../player/player";
import { BubbleEnemyBody } from "../../body";
import { BubbleEnemyMachine } from "../machine";
import { BubbleEnemyState } from "./state";
import { AimState } from "./aim";
import { adapter } from "../../../../../../../../scene/main-scene";
import { enemies } from "../../../../../../../../helpers/vars";

export class AttackState extends BubbleEnemyState {
  public constructor(public machine: BubbleEnemyMachine) {
    super(machine);
    const aimTransition = (machine: BubbleEnemyMachine) => {
      const bubbleEnemyBody =
        this.machine.enemy.getComponent<BubbleEnemyBody>(
          "body"
        );
      const bubbleEnemyBodyBody = bubbleEnemyBody.body;
      const player = playerInWorld;
      const playerBody = player.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();
      const screenPosition = adapter.getScreenPosition(playerPosition);
      const enemyPosition = Vec2(bubbleEnemyBody.enemy.x, bubbleEnemyBody.enemy.y);
      const distance = Vec2.distance(screenPosition, enemyPosition);

      if (distance <= enemies.bubbleEnemy.enemyRadius + 30) {
        // console.log('attacked');
        this.machine.state = new AimState(machine);
        this.machine.state.enter();
        return true;
      }
    };

    this.transitions.set("aim", aimTransition);
  }

  enter() {
    const bubbleEnemyBody =
      this.machine.enemy.getComponent<BubbleEnemyBody>(
        "body"
      );
    const bubbleEnemyBodyBody = bubbleEnemyBody.body;
    bubbleEnemyBodyBody.setGravityScale(0);

    const player = playerInWorld;
    const playerBody = player.getComponent<PlayerBody>("player-body");
    const playerPosition = playerBody.body.getPosition();
    const screenPosition = adapter.getScreenPosition(playerPosition);
    const enemyPosition = Vec2(bubbleEnemyBody.enemy.x, bubbleEnemyBody.enemy.y);
    bubbleEnemyBodyBody.setLinearVelocity(Vec2((screenPosition.x - enemyPosition.x) / 10, (screenPosition.y - enemyPosition.y) / 10));
    
  }

  update() {
    if (!this.machine.enemy.dead) {
      const bubbleEnemyBody =
        this.machine.enemy.getComponent<BubbleEnemyBody>(
          "body"
        );
      const bubbleEnemyBodyBody = bubbleEnemyBody.body;
      bubbleEnemyBodyBody.setGravityScale(0);

      const player = playerInWorld;
      const playerBody = player.getComponent<PlayerBody>("player-body");
      const playerPosition = playerBody.body.getPosition();
      const screenPosition = adapter.getScreenPosition(playerPosition);
      const enemyPosition = Vec2(bubbleEnemyBody.enemy.x, bubbleEnemyBody.enemy.y);
      bubbleEnemyBodyBody.setLinearVelocity(Vec2((screenPosition.x - enemyPosition.x) / 10, (screenPosition.y - enemyPosition.y) / 10));
      
    }

    // if (this.machine.enemy.life <= 0 && !this.machine.enemy.dead) {
    //   const bubble = this.machine.enemy;
    //   const scene = bubble.scene;
    //   const container = bubble.container;

    //   scene.tweens.add({
    //     targets: [container],
    //     alpha: 0,
    //     duration: 400,
    //     onComplete: () => {
    //       bubble.destroy();
    //       GameCore.points += 100;
    //       LetterSystem.enemySpawned -= 1;
    //     },
    //   });
    //   bubble.dead = true;
    // }
    super.update();
  }
}

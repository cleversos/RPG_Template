import { Vec2 } from "planck-js";
import { GameCore } from "../../../../../../../../core/game";
import { LetterSystem } from "../../../../../../../letter-system/letter-system";
import { PlayerBody } from "../../../../../../../player/components/body";
import { playerInWorld } from "../../../../../../../player/player";
import { BubbleEnemyBody } from "../../body";
import { BubbleEnemyMachine } from "../machine";
import { BubbleEnemyState } from "./state";
import { AttackState } from "./attack";
import { adapter } from "../../../../../../../../scene/main-scene";

export class AimState extends BubbleEnemyState {
  public constructor(public machine: BubbleEnemyMachine) {
    super(machine);
    const attackTransition = (machine: BubbleEnemyMachine) => {
      if(Math.abs(this.machine.enemy.x - this.machine.movement.bubbleEnemy.aimPosition) <=20 ){
        // console.log('will attack');

        this.machine.state = new AttackState(machine);
        this.machine.state.enter();
        return true;
      }
    };
    
    this.transitions.set("attack", attackTransition);
  }

  enter() {
    // console.log('aiming');

    // console.log(this.machine.bubbleEnemy.name + " entered AimState");
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
    this.machine.movement.bubbleEnemy.aimPosition = screenPosition.x - 100 + Math.floor(Math.random()*200);
    const enemyPosition = Vec2(bubbleEnemyBody.enemy.x, bubbleEnemyBody.enemy.y);
    const distanceToPlayer = Vec2.distance(Vec2(this.machine.movement.bubbleEnemy.aimPosition, this.machine.movement.bubbleEnemy.aimHeight), enemyPosition);
    const speedLength = Vec2.distance(this.machine.movement.speed, Vec2(0,0));
    const divider = 5*distanceToPlayer/speedLength;
    bubbleEnemyBodyBody.setLinearVelocity(Vec2((this.machine.movement.bubbleEnemy.aimPosition-enemyPosition.x)/divider, (this.machine.movement.bubbleEnemy.aimHeight-enemyPosition.y)/divider));
  }

  update() {
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

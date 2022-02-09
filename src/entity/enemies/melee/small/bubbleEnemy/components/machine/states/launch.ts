import { Vec2 } from "planck-js";
import { GameCore } from "../../../../../../../../core/game";
import { LetterSystem } from "../../../../../../../letter-system/letter-system";
import { BubbleEnemyBody } from "../../body";
import { BubbleEnemyMachine } from "../machine";
import { BubbleEnemyState } from "./state";
import { AimState } from "./aim";

export class LaunchState extends BubbleEnemyState {
  public constructor(public machine: BubbleEnemyMachine) {
    super(machine);
    const aimTransition = (machine: BubbleEnemyMachine) => {

      if(Math.abs(this.machine.enemy.y - this.machine.movement.bubbleEnemy.aimHeight) < 20){
        this.machine.state = new AimState(machine);
        this.machine.state.enter();
        return true;
      }
    };

    this.transitions.set("aim", aimTransition);
  }

  enter() {
    const bubbleEnemyBody =
      this.machine.enemy.getComponent<BubbleEnemyBody>("body");
    const bubbleEnemyBodyBody = bubbleEnemyBody.body;
    bubbleEnemyBodyBody.setLinearVelocity(
      Vec2(
        this.machine.movement.speed.x * this.machine.enemy.direction,
        -this.machine.movement.speed.y
      )
    );
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

import { enemies } from "../../../../../../../../helpers/vars";
import { HeatEnemyAvatar, heat_animationNames } from "../../avatar";
import { HeatEnemyMachine } from "../machine";
import { HeatEnemyState } from "./state";

export class DeadState extends HeatEnemyState {
  public timePassed: boolean = false;

  public constructor(public machine: HeatEnemyMachine) {
    super(machine);
  }

  enter() {
    const avatar =
      this.machine.enemy.getComponent<HeatEnemyAvatar>("avatar");
    // console.log("heat died");
    avatar.playAnimation(heat_animationNames.IDLE);

    // alpha and destory timer
    this.machine.enemy.scene.tweens.add({
      targets: avatar.avatar,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        console.log("destroying");
        this.machine.enemy.destroy();
      },
    });

    const randomRotationTweenDir = Math.random() < 0.5 ? -1 : 1;
    // rotation tween
    this.machine.enemy.scene.tweens.add({
      targets: avatar.avatar,
      angle: 270 * randomRotationTweenDir,
      duration: 500
    });
  }

  update() {
    super.update();
  }
}

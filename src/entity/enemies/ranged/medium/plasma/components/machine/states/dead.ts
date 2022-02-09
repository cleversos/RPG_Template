import { enemies } from "../../../../../../../../helpers/vars";
import { PlasmaEnemyAvatar, plasma_animationNames } from "../../avatar";
import { PlasmaEnemyMachine } from "../machine";
import { PlasmaEnemyState } from "./state";

export class DeadState extends PlasmaEnemyState {
  public timePassed: boolean = false;

  public constructor(public machine: PlasmaEnemyMachine) {
    super(machine);
  }

  enter() {
    const avatar =
      this.machine.enemy.getComponent<PlasmaEnemyAvatar>("avatar");
    // console.log("plasma died");
    avatar.playAnimation(plasma_animationNames.IDLE);

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

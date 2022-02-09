import { HoleMachine } from "../machine";
import { HoleState } from "./state";

export class HoleCloseState extends HoleState {
  public constructor(public machine: HoleMachine) {
    super(machine);
  }

  public enter() {
    const animation = this.machine.animation.animationObject;
    animation.action = 0;
    animation.loop = false;
    animation.reversed = true;
    animation.frame = animation.getAnimationSize();
    animation.getFrame();
  }

  public update() {
    const animation = this.machine.animation.animationObject;
    if (animation.frame === 0) {
      console.log("destroy parent hole");
      this.machine.parent.destroy();
    }
  }
}

import { AnimationData } from "../../../../../animation/data";
import { HoleState } from "./state";
import { HoleMachine } from "../machine";
import { HoleLoopState } from "./loop";

export class HoleIntroState extends HoleState {
  public constructor(public machine: HoleMachine) {
    super(machine);
    const loopTransition = (machine: HoleMachine) => {
      const animation = machine.animation.animationObject;
      const end = animation.getAnimationSize();
      if (!end) return;
      if (animation.frame + 1 >= end) {
        machine.setState(new HoleLoopState(machine));
        return true;
      }

      return false;
    };

    this.transitions.set("loopTransition", loopTransition);
  }

  public enter() {
    const animation = this.machine.animation.animationObject;
    animation.action = 0;
    animation.loop = false;
    animation.frame = 0;
  }
}

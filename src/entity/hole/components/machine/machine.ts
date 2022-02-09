import { Machine, State } from "../../../machine";
import { Hole } from "../../hole";
import { HoleAnimation } from "../animation";
import { HoleIntroState } from "./states/intro";
import { HoleState } from "./states/state";

export class HoleMachine extends Machine {
  public state: HoleState;
  public animation: HoleAnimation;

  public constructor(public parent: Hole) {
    super();
    this.animation = parent.getComponent<HoleAnimation>("hole-animation");
    this.setState(new HoleIntroState(this));
  }

  public setState(state: HoleState) {
    super.setState(state);
  }
}

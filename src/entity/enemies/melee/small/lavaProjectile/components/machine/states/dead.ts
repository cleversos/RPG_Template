import { enemies } from "../../../../../../../../helpers/vars";
import { LavaProjectileAvatar } from "../../avatar";
import { LavaProjectileMachine } from "../machine";
import { LavaProjectileState } from "./state";

export class DeadState extends LavaProjectileState {
  public timePassed: boolean = false;

  public constructor(public machine: LavaProjectileMachine) {
    super(machine);
  }

  enter() {
    const avatar =
      this.machine.enemy.getComponent<LavaProjectileAvatar>("avatar");
    console.log("lava projectile died");
  }

  update() {
    super.update();
  }
}

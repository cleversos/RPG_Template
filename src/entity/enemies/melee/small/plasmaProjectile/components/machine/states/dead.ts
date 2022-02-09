import { enemies } from "../../../../../../../../helpers/vars";
import { PlasmaProjectileAvatar } from "../../avatar";
import { PlasmaProjectileMachine } from "../machine";
import { PlasmaProjectileState } from "./state";

export class DeadState extends PlasmaProjectileState {
  public timePassed: boolean = false;

  public constructor(public machine: PlasmaProjectileMachine) {
    super(machine);
  }

  enter() {
    const avatar =
      this.machine.enemy.getComponent<PlasmaProjectileAvatar>("avatar");
    console.log("plasma projectile died");
  }

  update() {
    super.update();
  }
}

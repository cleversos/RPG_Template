import { EntityComponent } from "../../entity";
import { Hole } from "../hole";
import { HoleMachine } from "./machine/machine";

export class HoleController extends EntityComponent {
  public machine: HoleMachine;
  public constructor(public parent: Hole) {
    super();
  }

  public start() {
    this.machine = new HoleMachine(this.parent);
  }

  public update() {
    this.machine.update();
  }
}

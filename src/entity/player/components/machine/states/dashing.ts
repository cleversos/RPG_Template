import { Vec2 } from "planck-js";
import { Player } from "../../../player";
import { PlayerAvatar } from "../../avatar";
import { PlayerBody } from "../../body";
import { PlayerMachine } from "../machine";
import { IdleState } from "./idle";
import { PlayerState } from "./state";

export class PlayerDashingState extends PlayerState {
  public avatar: PlayerAvatar;
  public dashDuration: number;
  public constructor(public machine: PlayerMachine) {
    super(machine);
    const avatar = (this.avatar =
      machine.player.getComponent<PlayerAvatar>("player-avatar"));
    const idleTranstion = (machine: PlayerMachine) => {
      if (this.dashDuration <= 0) {
        machine.state = new IdleState(machine);
        machine.state.enter();
        return true;
      }
      return false;
    };

    this.transitions.set("idle", idleTranstion);
  }

  public enter() {
    this.avatar.avatar.action = 10;
    this.avatar.avatar.loop = false;
    this.avatar.avatar.frame = 0;
    this.avatar.avatar.getFrame();
    this.dashDuration = 200;
  }

  public update() {
    const playerBody =
      this.machine.player.getComponent<PlayerBody>("player-body");
    const velocity = playerBody.body.getLinearVelocity();
    const dashVelocity = Vec2(this.avatar.avatar.image.scaleX * 25, velocity.y);
    this.dashDuration -= 1000 / 80;
    playerBody.body.setLinearVelocity(dashVelocity);
    super.update();
  }
}

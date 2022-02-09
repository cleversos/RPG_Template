import { Vec2 } from "planck-js";
import { PlayerAvatar } from "../../avatar";
import { PlayerBody } from "../../body";
import { PlayerMachine } from "../machine";
import { IdleState } from "./idle";
import { PlayerState } from "./state";

export class DodgingState extends PlayerState {
  public avatar: PlayerAvatar;
  public constructor(public machine: PlayerMachine) {
    super(machine);
    this.avatar = machine.player.getComponent<PlayerAvatar>("player-avatar");

    const idleTransition = (machine: PlayerMachine) => {
      const avatar = this.avatar.avatar;
      const animationSize = avatar.getAnimationSize();
      if (avatar.frame + 1 >= animationSize) {
        machine.movement.preventKnockBack = false;
        machine.state = new IdleState(machine);
        machine.state.enter();
        return true;
      }
      return false;
    };
    this.transitions.set("idle", idleTransition);
  }

  public enter() {
    const avatar = this.avatar.avatar;
    avatar.action = 9;
    avatar.frame = 0;
    avatar.loop = false;
    avatar.getFrame();
    this.machine.movement.preventKnockBack = true;
  }

  public update(): void {
    const playerBody =
      this.machine.player.getComponent<PlayerBody>("player-body");
    const velocity = playerBody.body.getLinearVelocity();
    const dodgingVelocity = Vec2(
      this.avatar.avatar.image.scaleX * 16,
      velocity.y
    );

    playerBody.body.setLinearVelocity(dodgingVelocity);
    super.update();
  }
}

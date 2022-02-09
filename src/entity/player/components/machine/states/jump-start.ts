import { Vec2 } from "planck-js";
import { AnimationData } from "../../../../../animation/data";
import { PlayerBody } from "../../body";
import { PlayerMachine } from "../machine";
import { IdleState } from "./idle";
import { MidAirState } from "./mid-air";
import { PlayerState } from "./state";

export class JumpStartState extends PlayerState {
  public constructor(public machine: PlayerMachine) {
    super(machine);
    const idleTransition = (machine: PlayerMachine) => {
      const avatar = this.machine.avatar.avatar;
      const data = AnimationData.get(
        this.machine.player.scene,
        avatar.animation
      );
      if (!data) return;
      const action = data.actionsFrames.get(avatar.action);
      if (!action) return;

      if (
        avatar.frame + 1 === action.size ||
        this.machine.movement.bigJumpKey.isUp
      ) {
        this.machine.state = new MidAirState(machine);

        this.machine.player
          .getComponent<PlayerBody>("player-body")
          .body.setLinearVelocity(Vec2(0, -1 * (144 + avatar.frame * 2.2)));
        this.machine.state.enter();
        return true;
      }
    };
    this.transitions.set("idle", idleTransition);
  }
  enter() {
    const avatar = this.machine.avatar;
    avatar.avatar.action = 2;
    avatar.avatar.frame = 0;
    avatar.avatar.loop = false;
    avatar.avatar.framerate = 1000 / 80;
  }

  update() {
    const playerBody =
      this.machine.player.getComponent<PlayerBody>("player-body");
    const body = playerBody.body;
    const bodyVelocity = body.getLinearVelocity();
    body.setLinearVelocity(Vec2(0, bodyVelocity.y));
    body.setAngularVelocity(0);
    super.update();
  }
}

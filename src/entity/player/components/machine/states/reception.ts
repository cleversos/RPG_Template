import { Vec2 } from "planck-js";
import { AnimationData } from "../../../../../animation/data";
import { PlayerBody } from "../../body";
import { PlayerMovement } from "../../movement";
import { PlayerAbilities } from "../../abilities";
import { PlayerMachine } from "../machine";
import { IdleState } from "./idle";
import { PlayerState } from "./state";

export class ReceptionState extends PlayerState {
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
        this.machine.movement.inputs.left.isDown ||
        this.machine.movement.inputs.right.isDown
      ) {
        this.machine.state = new IdleState(machine);
        this.machine.state.enter();
        return true;
      }
    };
    this.transitions.set("idle", idleTransition);
  }
  enter() {
    const avatar = this.machine.avatar;
    avatar.avatar.action = 5;
    avatar.avatar.frame = 0;
    avatar.avatar.loop = false;
    const playerMovement =
      this.machine.player.getComponent<PlayerMovement>("player-movement");
    playerMovement.landedAfterKnockBack = true;
  }

  update() {
    const playerAbilities =
      this.machine.player.getComponent<PlayerAbilities>("player-abilities");
    playerAbilities.handleAbilityInputs();
    const playerBody =
      this.machine.player.getComponent<PlayerBody>("player-body");
    const body = playerBody.body;
    const bodyVelocity = body.getLinearVelocity();
    body.setLinearVelocity(Vec2(0, bodyVelocity.y));
    body.setAngularVelocity(0);
    super.update();
  }
}

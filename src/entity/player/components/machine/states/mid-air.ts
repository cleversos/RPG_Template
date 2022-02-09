import { Vec2 } from "planck-js";
import { GameCore } from "../../../../../core/game";
import { PLAYER_VARS } from "../../../../../helpers/vars";
import { PlayerBody } from "../../body";
import { PlayerMachine } from "../machine";
import { AttackState } from "./attack";
import { PlayerDashingState } from "./dashing";
import { FallState } from "./fall";
import { ReceptionState } from "./reception";
import { PlayerState } from "./state";

export class MidAirState extends PlayerState {
  public constructor(public machine: PlayerMachine) {
    super(machine);
    const fallTransition = (machine: PlayerMachine) => {
      const playerBody =
        this.machine.player.getComponent<PlayerBody>("player-body");
      const body = playerBody.body;
      const bodyVelocity = body.getLinearVelocity();

      const grounded = playerBody.onGround();

      if (bodyVelocity.y >= 2) {
        this.machine.state = new FallState(machine);
        this.machine.state.enter();
        return true;
      }
    };
    const attackTransition = (machine: PlayerMachine) => {
      const movement = this.machine.movement;
      if (movement.hitKey.isDown) {
        machine.state = new AttackState(machine, 8);
        machine.state.enter();
        return true;
      }
    };

    const dashTransition = (machine: PlayerMachine) => {
      const movement = this.machine.movement;
      if (
        movement.dashKey.isDown &&
        GameCore.stamina > PLAYER_VARS.movementCost.dash
      ) {
        GameCore.stamina -= PLAYER_VARS.movementCost.dash;
        this.machine.state = new PlayerDashingState(machine);
        this.machine.state.enter();
        return true;
      }
    };
    this.transitions.set("dashing", dashTransition);
    this.transitions.set("attack", attackTransition);
    this.transitions.set("fall", fallTransition);
  }
  enter() {
    const avatar = this.machine.avatar;
    avatar.avatar.action = 3;
    avatar.avatar.frame = 0;
    avatar.avatar.loop = false;
  }

  update() {
    const avatar = this.machine.avatar;
    const movement = this.machine.movement;
    const body =
      this.machine.player.getComponent<PlayerBody>("player-body").body;
    const inputsKey = movement.inputs;
    const inputs = Vec2();

    const bodyVelocity = body.getLinearVelocity();

    if (inputsKey.left.isDown) inputs.x = -1;
    else if (inputsKey.right.isDown) inputs.x = 1;

    if (inputsKey.up.isDown) inputs.y = -1;

    if (!this.machine.movement.knockBack)
      body.setLinearVelocity(Vec2(inputs.x * 14, bodyVelocity.y));
    else return;

    if (inputs.x !== 0)
      avatar.avatar.image.scaleX = avatar.attackSlash.image.scaleX = inputs.x;

    super.update();
  }
}

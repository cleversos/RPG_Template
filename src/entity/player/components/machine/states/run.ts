import { Vec2 } from "planck-js";
import { GameCore } from "../../../../../core/game";
import { PLAYER_VARS } from "../../../../../helpers/vars";
import { PlayerAbilities } from "../../abilities";
import { PlayerBody } from "../../body";
import { PlayerMovement } from "../../movement";
import { PlayerMachine } from "../machine";
import { AttackState } from "./attack";
import { PlayerDashingState } from "./dashing";
import { DodgingState } from "./dodging";
import { IdleState } from "./idle";
import { JumpStartState } from "./jump-start";
import { MidAirState } from "./mid-air";
import { PlayerState } from "./state";

export class RunState extends PlayerState {
  public constructor(public machine: PlayerMachine) {
    super(machine);
    const idleTransition = (machine: PlayerMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;
      const inputsKey = movement.inputs;
      const inputs = Vec2();

      if (inputsKey.left.isDown) inputs.x = -1;
      else if (inputsKey.right.isDown) inputs.x = 1;

      if (inputsKey.up.isDown) inputs.y = -1;

      if (avatar && movement && inputs) {
        if (inputs.x === 0 && inputs.y === 0) {
          machine.state = new IdleState(machine);
          machine.state.enter();

          return true;
        } else if (inputs.y === -1) {
          this.machine.player
            .getComponent<PlayerBody>("player-body")
            .body.setLinearVelocity(Vec2(0, -1 * 84));
          this.machine.state = new MidAirState(machine);
          this.machine.state.enter();
          return true;
        } else if (movement.bigJumpKey.isDown) {
          this.machine.state = new JumpStartState(machine);
          this.machine.state.enter();
          return true;
        }
      }
    };

    const attackTransition = (machine: PlayerMachine) => {
      const movement = this.machine.movement;
      if (movement.hitKey.isDown) {
        machine.state = new AttackState(machine, 7);
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

    const dodgingTranstion = (machine: PlayerMachine) => {
      const movement = this.machine.movement;
      if (
        movement.dodgingKey.isDown &&
        GameCore.stamina >= PLAYER_VARS.movementCost.dodging
      ) {
        GameCore.stamina -= PLAYER_VARS.movementCost.dodging;
        this.machine.state = new DodgingState(machine);
        this.machine.state.enter();
        return true;
      }
    };

    this.transitions.set("dodging", dodgingTranstion);
    this.transitions.set("dashing", dashTransition);
    this.transitions.set("attack", attackTransition);

    this.transitions.set("idle", idleTransition);
  }
  enter() {
    const avatar = this.machine.avatar;
    avatar.avatar.action = 1;
    avatar.avatar.frame = 0;
    avatar.avatar.loop = true;
    avatar.avatar.framerate = 1000 / 72;
    const playerMovement =
      this.machine.player.getComponent<PlayerMovement>("player-movement");
    playerMovement.landedAfterKnockBack = true;
  }

  update() {
    const avatar = this.machine.avatar;
    const movement = this.machine.movement;
    const body =
      this.machine.player.getComponent<PlayerBody>("player-body").body;
    const inputsKey = movement.inputs;
    const inputs = Vec2();

    const playerAbilities =
      this.machine.player.getComponent<PlayerAbilities>("player-abilities");
    // playerAbilities.handleAbilityInputs();

    const bodyVelocity = body.getLinearVelocity();

    if (inputsKey.left.isDown) inputs.x = -1;
    else if (inputsKey.right.isDown) inputs.x = 1;

    if (inputsKey.up.isDown) inputs.y = -1;

    if (!this.machine.movement.knockBack)
      body.setLinearVelocity(Vec2(inputs.x * 11, bodyVelocity.y));

    if (inputs.x !== 0)
      avatar.avatar.image.scaleX = avatar.attackSlash.image.scaleX = inputs.x;

    super.update();
  }
}

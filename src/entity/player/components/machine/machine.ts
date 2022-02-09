import { Player } from "../../player";
import { PlayerAvatar } from "../avatar";
import { PlayerMovement } from "../movement";
import { IdleState } from "./states/idle";
import { PlayerState } from "./states/state";

/**
 *
 *
 * Player abilities machine
 * to use an abilities, the player need at less 1 as value in GameCore stats
 * on that specific abilities
 *
 *
 * Elemental check -> Water, Fire
 *
 * Fire :
 *    - J : Fire-Two
 *    - K : Fire-One
 *    - L : Fire-Three
 * Water :
 *    - J : Wave Attack
 *    - K : Bubble attack
 *    - L : Rain
 *
 * We'll use E key to switch element
 *
 * abilities still work the same ways, just we'll use keys to trigger them
 * depending on what elemental our player is using
 *
 * for that the first ways is to setup a component to handle all of that and trigger / stack abilities
 * depending of our stamina (energy bar)
 */

export class PlayerMachine {
  public avatar: PlayerAvatar;
  public movement: PlayerMovement;
  public state: PlayerState;

  public constructor(public player: Player) {
    this.avatar = player.getComponent<PlayerAvatar>("player-avatar");
    this.movement = player.getComponent<PlayerMovement>("player-movement");
    this.state = new IdleState(this);
    this.state.enter();
  }

  public update() {
    if (this.state) this.state.update();
  }

  public setState(state: PlayerState) {
    if (this.state) this.state.leave();
    this.state = state;
    state.enter();
  }
}

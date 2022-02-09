import { Game } from "phaser";
import { GameCore } from "../../../../../core/game";
import { PlayerMachine } from "../machine";
import { playerInWorld } from "../../../../player/player";
import { PlayerAvatar } from "../../avatar";
import { PlayerMovement } from "../../movement";

export class PlayerState {
  public constructor(public machine: PlayerMachine) {}
  public transitions: Map<string, (machine: PlayerMachine) => boolean> =
    new Map();
  public enter() {}
  public leave() {}
  public update() {
    if (GameCore.remainPoison > 0) {
      let curTime = new Date();
      let curMiliseconds = curTime.getTime();
      if (curMiliseconds - GameCore.poisonTime >= 5000) {
        GameCore.remainPoison -= 1;
        const player = playerInWorld;
        if (GameCore.remainPoison == 0) {
          const playerAvatar =
            player.getComponent<PlayerAvatar>("player-avatar");
          playerAvatar.avatar.image.clearTint();
        }

        const movement = player.getComponent<PlayerMovement>("player-movement");
        GameCore.poisonTime = curMiliseconds;
        if (!movement.preventKnockBack) GameCore.heart -= 1;

        this.machine.movement.knockback(
          -this.machine.avatar.avatar.image.scaleX
        );
        console.log("heart reduced", GameCore.remainPoison, GameCore.heart);
      }
    }

    const transitionsList = Array.from(this.transitions.values());
    for (let i = 0; i < transitionsList.length; i += 1) {
      const transition = transitionsList[i];
      if (transition(this.machine)) {
        return;
      }
    }
  }
}

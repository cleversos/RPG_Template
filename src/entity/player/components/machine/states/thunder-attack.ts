import { Player } from "../../../player";
import { ThunderAttack } from "../../abilities/lighting/entity/thunder/thunder";
import { LightingTwo } from "../../abilities/lighting/lighting-two";
import { PlayerAvatar } from "../../avatar";
import { PlayerMachine } from "../machine";
import { IdleState } from "./idle";
import { PlayerState } from "./state";

export class ThunderAttackState extends PlayerState {
  public avatar: PlayerAvatar;
  public explosion: ThunderAttack;
  public player: Player;

  public constructor(
    public machine: PlayerMachine,
    public ability: LightingTwo
  ) {
    super(machine);
    this.player = machine.player;
    this.avatar = machine.player.getComponent<PlayerAvatar>("player-avatar");
    const idleTransition = (machine: PlayerMachine) => {
      if (!this.explosion) return false;
      const explosion = this.explosion;
      console.log(explosion && explosion.explosionOver);
      if (explosion.explosionOver) {
        const movement = this.machine.movement;
        movement.preventKnockBack = false;
        machine.state = new IdleState(machine);
        this.avatar.avatar.pause = false;
        machine.state.enter();
        this.ability.running = false;

        return true;
      }
    };

    this.transitions.set("idle", idleTransition);
  }

  public enter() {
    const movement = this.machine.movement;
    const avatar = this.avatar.avatar;
    avatar.action = 2;
    avatar.frame = 0;
    avatar.loop = false;
    movement.preventKnockBack = true;
  }

  public update() {
    const avatar = this.avatar.avatar;
    if (avatar.frame === 4 && !avatar.pause) {
      avatar.pause = true;
      this.explosion = new ThunderAttack(
        this.player.x,
        this.player.y,
        this.player.scene
      );
    }
    super.update();
  }
}

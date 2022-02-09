import { Player } from "../../../player";
import { BubbleAttack } from "../../abilities/water/entity/bubble-attack/bubble-attack";
import { WaveAttackAnimation } from "../../abilities/water/entity/wave-attack/components/animation";
import { WaveAttack } from "../../abilities/water/entity/wave-attack/wave-attack";
import { WaterThree } from "../../abilities/water/water-three";
import { WaterTwo } from "../../abilities/water/water-two";
import { PlayerAvatar } from "../../avatar";
import { PlayerBody } from "../../body";
import { PlayerMovement } from "../../movement";
import { PlayerMachine } from "../machine";
import { IdleState } from "./idle";
import { PlayerState } from "./state";

export class WaveAttackState extends PlayerState {
  public avatar: PlayerAvatar;
  public wave: WaveAttack;
  public player: Player;

  public nextWaveDelay: number = 2000;

  public constructor(
    public machine: PlayerMachine,
    public ability: WaterThree,
    public waveOffset: number
  ) {
    super(machine);
    this.player = machine.player;
    this.avatar = machine.player.getComponent<PlayerAvatar>("player-avatar");
    const idleTransition = (machine: PlayerMachine) => {
      if (!this.wave) return false;
      if (!this.wave.waveOver) return false;
      const avatar = this.avatar.avatar;
      if (this.wave.waveOver && this.ability.abilityAmmo > 0) {
        this.ability.abilityAmmo -= 1;
        this.waveOffset = this.ability.waveOffset =
          this.ability.waveOffset + 1 > 3 ? 0 : this.ability.waveOffset + 1;
        this.wave = new WaveAttack(
          this.player.x + 40 * this.waveOffset * avatar.image.scaleX,
          this.player.y + 20,
          avatar.image.scaleX,
          this.player.scene
        );
        return;
      }

      if (avatar.pause) {
        const movement = this.machine.movement;
        movement.preventKnockBack = false;
        machine.state = new IdleState(machine);
        machine.state.enter();
        this.ability.waveSpawn = false;

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
    if (avatar.frame === 2 && !avatar.pause) {
      avatar.pause = true;
      this.wave = new WaveAttack(
        this.player.x + 40 * this.waveOffset * avatar.image.scaleX,
        this.player.y + 20,
        avatar.image.scaleX,
        this.player.scene
      );
    }
    super.update();
  }
}

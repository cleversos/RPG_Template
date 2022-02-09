import { MainScene } from "../../../../../scene/main-scene";
import { Player } from "../../../player";
import { PlayerAbilities } from "../../abilities";
import { PlayerBody } from "../../body";
import { PlayerMachine } from "../../machine/machine";
import { WaveAttackState } from "../../machine/states/wave-attack";
import { PlayerMovement } from "../../movement";
import { ConsumableAbility } from "../ability";
import { WaveAttack } from "./entity/wave-attack/wave-attack";

export class WaterThree extends ConsumableAbility {
  public abilityAmmo: number;
  public scene: MainScene;
  public player: Player;
  public playerBody: PlayerBody;
  public playerMachine: PlayerMachine;

  public waveOffset: number = 0;
  public waveSpawn: boolean = false;

  public constructor(public parent: PlayerAbilities) {
    super();
    this.player = parent.parent;
    this.playerBody = this.player.getComponent<PlayerBody>("player-body");
    this.playerMachine =
      this.player.getComponent<PlayerMovement>("player-movement").machine;
    this.scene = parent.parent.scene;
    this._init();
  }

  private _init() {
    this.abilityAmmo = 1;
  }

  public update() {
    if (this.abilityAmmo > 0) {
      this.createWave();
    } else {
      this.waveOffset = 0;
    }
  }

  public createWave() {
    if (this.grounded && !this.waveSpawn) {
      // setSpawnWaveState
      this.playerMachine.setState(
        new WaveAttackState(this.playerMachine, this, this.waveOffset)
      );
      this.waveSpawn = true;
      this.abilityAmmo -= 1;
      // increase offset or reset to 0
      if (this.waveOffset + 1 < 3) {
        this.waveOffset += 1;
      } else {
        this.waveOffset = 0;
      }
    }
  }

  public stack() {
    this.abilityAmmo += 1;
  }

  public grounded() {
    const groundContactManager = this.playerBody.contactsManager.get("ground");
    let grounded = false;
    if (groundContactManager) {
      grounded = groundContactManager.activeContact.size !== 0;
    }
    return grounded;
  }
}

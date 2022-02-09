import { MainScene } from "../../../../../scene/main-scene";
import { Player } from "../../../player";
import { PlayerAbilities } from "../../abilities";
import { PlayerBody } from "../../body";
import { PlayerMachine } from "../../machine/machine";
import { BubbleAttackState } from "../../machine/states/bubble-attack";
import { ThunderAttackState } from "../../machine/states/thunder-attack";
import { PlayerMovement } from "../../movement";
import { ConsumableAbility } from "../ability";

export class LightingTwo extends ConsumableAbility {
  public scene: MainScene;
  public player: Player;
  public playerBody: PlayerBody;
  public playerMachine: PlayerMachine;

  public abilityAmmo: number;

  public running: boolean = false;
  public constructor(public abilities: PlayerAbilities) {
    super();
    this.player = abilities.parent;
    this.playerBody = this.player.getComponent<PlayerBody>("player-body");
    this.playerMachine =
      this.player.getComponent<PlayerMovement>("player-movement").machine;
    this.scene = abilities.parent.scene;
    this._init();
  }

  private _init() {
    this.abilityAmmo = 1;
    this.explode();
  }

  public explode() {
    if (this.grounded() && this.abilityAmmo > 0) {
      this.running = true;
      this.abilityAmmo -= 1;
      this.playerMachine.setState(
        new ThunderAttackState(this.playerMachine, this)
      );
    }
  }

  public stack() {
    this.abilityAmmo += 1;
  }

  public update() {
    if (!this.running && this.abilityAmmo > 0) {
      this.explode();
    }
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

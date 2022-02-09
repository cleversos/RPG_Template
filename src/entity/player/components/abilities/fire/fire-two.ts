import { Box, Vec2 } from "planck-js";
import { AnimationObject } from "../../../../../animation/animation";
import { PlanckPhaserAdapter } from "../../../../../physic/planck-phaser-adapter";
import { Player } from "../../../player";
import { PlayerAbilities } from "../../abilities";
import { PlayerAvatar } from "../../avatar";
import { PlayerCollision } from "../../collision";
import { PlayerMachine } from "../../machine/machine";
import { AttackState } from "../../machine/states/attack";
import { PlayerMovement } from "../../movement";
import { ConsumableAbility } from "../ability";
import { FireAbility } from "./fire";

const adapter = PlanckPhaserAdapter;

export class FireTwo extends ConsumableAbility {
  public player: Player;
  public playerAvatar: PlayerAvatar;
  public playerCollision: PlayerCollision;

  public defaultSlashSprite: AnimationObject;
  public abilitySprite: AnimationObject;
  public playerMachine: PlayerMachine;

  public abilityAmmo = 1;

  public constructor(public parent: PlayerAbilities) {
    super();
    this.player = parent.parent;
    this.playerMachine =
      this.player.getComponent<PlayerMovement>("player-movement").machine;
    this.playerAvatar = this.player.getComponent<PlayerAvatar>("player-avatar");
    this.playerCollision = parent.playerCollision;
    this.init();
  }

  public init() {
    const player = this.player;

    const slashSprite = this.playerAvatar.attackSlash;
    this.defaultSlashSprite = slashSprite;
    const abilitySlashSprite = new AnimationObject(player.scene, "4", 0, 25);

    this.playerAvatar.attackSlash = abilitySlashSprite;
    this.playerAvatar.attackSlash.action = 1;
    this.playerAvatar.attackSlash.frame = 0;

    this.playerAvatar.attackSlash.getFrame();

    player.container.add(abilitySlashSprite.image);

    player.container.addListener("hit-enemy", this.hitEnemy.bind(this));
    this.updateAttackSensor();
    slashSprite.image.setVisible(false);

    this.abilitySprite = abilitySlashSprite;
    this.parent.attackSensor = "fire-attack";
    this.playerMachine.setState(new AttackState(this.playerMachine, 7));
  }

  public updateAttackSensor() {
    // const worldScale = adapter.planckPhysics.worldScale;
    // this.playerCollision.updateAttackSensor(
    //   Box(
    //     (this.playerAvatar.attackSlash.image.width / 2) * worldScale,
    //     30 * worldScale,
    //     Vec2()
    //   )
    // );
    // const fixture =
    //   this.playerCollision.playerBody.attackSensor.getFixtureList();
    // const box = fixture.m_shape as Box;
  }

  public hitEnemy(hit: boolean) {
    console.log("enemy hit");
    if (this.abilityAmmo > 0) this.abilityAmmo -= 1;
  }

  public update() {
    if (
      this.abilityAmmo <= 0 &&
      this.playerAvatar.attackSlash === this.abilitySprite
    ) {
      this.abilitySprite.image.setVisible(false);
      this.playerAvatar.attackSlash = this.defaultSlashSprite;
      this.playerAvatar.attackSlash.getFrame();
      this.defaultSlashSprite.image.setVisible(true);
      this.parent.attackSensor = "base-attack";
    }

    if (
      this.abilityAmmo > 0 &&
      this.playerAvatar.attackSlash === this.defaultSlashSprite
    ) {
      this.abilitySprite.image.setVisible(true);
      this.playerAvatar.attackSlash = this.abilitySprite;
      this.playerAvatar.attackSlash.action = 1;
      this.playerAvatar.attackSlash.frame = 0;
      this.playerAvatar.attackSlash.getFrame();
      this.defaultSlashSprite.image.setVisible(false);
      this.parent.attackSensor = "fire-attack";
    }
  }

  public stack() {
    this.abilityAmmo += 1;
    this.playerMachine.setState(new AttackState(this.playerMachine, 7));
  }
}

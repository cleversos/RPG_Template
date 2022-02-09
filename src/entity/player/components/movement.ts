import { Vec2 } from "planck-js";
import { EntityComponent } from "../../entity";
import { Player } from "../player";
import { PlayerBody } from "./body";
import { PlayerMachine } from "./machine/machine";

export class PlayerMovement extends EntityComponent {
  public inputs: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
  };
  public dashKey: Phaser.Input.Keyboard.Key;
  public dodgingKey: Phaser.Input.Keyboard.Key;
  public hitKey: Phaser.Input.Keyboard.Key;
  public bigJumpKey: Phaser.Input.Keyboard.Key;
  public machine: PlayerMachine;
  public speed: Vec2 = Vec2(40, 50);

  public preventKnockBack: boolean = false;
  public knockBack: boolean = false;
  public landedAfterKnockBack: boolean = true;
  public knockBackDelay: number = 0;
  public constructor(public player: Player) {
    super();
  }

  start() {
    const scene = this.player.scene;
    this.inputs = {
      left: scene.input.keyboard.addKey("A"),
      right: scene.input.keyboard.addKey("D"),
      up: scene.input.keyboard.addKey("W"),
      down: scene.input.keyboard.addKey("S"),
    };
    this.dashKey = scene.input.keyboard.addKey("F");
    this.dodgingKey = scene.input.keyboard.addKey("G");
    this.hitKey = this.player.scene.input.keyboard.addKey("H");
    this.bigJumpKey = this.player.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.machine = new PlayerMachine(this.player);
  }

  update() {
    if (this.knockBack) {
      if (this.knockBackDelay > 0) {
        this.knockBackDelay -= 1000 / 80;
      } else {
        console.log("make knockback false");
        this.knockBack = false;
        // console.log("no more knockback");
      }
    }
    this.machine.update();
  }

  knockback(
    moveDirection: number,
    bEffective: boolean = false,
    fx: number = 1000,
    fy: number = -7500
  ) {
    console.log(this.knockBack);
    if (this.knockBack) return;
    if (this.preventKnockBack) return;
    if (!this.landedAfterKnockBack) return;
    this.knockBack = true;
    this.knockBackDelay = 200;
    this.landedAfterKnockBack = false;
    console.log(this.knockBack);

    const playerBody = this.player.getComponent<PlayerBody>("player-body").body;

    // playerBody.setLinearVelocity(Vec2(fx * moveDirection, fy));
    playerBody.applyForceToCenter(Vec2(fx * moveDirection, fy));
  }
}

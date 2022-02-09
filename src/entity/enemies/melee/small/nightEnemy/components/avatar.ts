import { enemies } from "../../../../../../helpers/vars";
import { EnemyAvatar } from "../../../../avatar";
import { NightEnemy } from "../night-enemy";

export class NightEnemyAvatar extends EnemyAvatar {
  public avatar: any;
  public constructor( nightEnemy: NightEnemy ) {
    super(nightEnemy);
  }

  start() {
    const scene = this.enemy.scene;
    const container = this.enemy.container;

    this.createAnimation_walk();
    this.createAnimation_attack();
    this.createAnimation_idle();
    this.createAnimation_explode();
    this.createAnimation_dead();

    this.avatar = scene.add.sprite(
      0,
      enemies.nightEnemy.visualExtraY,
      "night-walk"
    );
    this.avatar.play("night-walk");

    container.add(this.avatar);
    container.setDepth(enemies.nightEnemy.textureDepth);
  }

  createAnimation_explode() {
    const scene = this.enemy.scene;

    scene.anims.create({
      key: "night-explode",
      frameRate: 30,
      frames: scene.anims.generateFrameNames("night-explode", {
        // prefix: "",
        // suffix: "",
        start: 0,
        end: 20,
        zeroPad: 2,
      }),
      repeat: 0,
    });
  }

  createAnimation_dead() {
    const scene = this.enemy.scene;

    scene.anims.create({
      key: "night-dead",
      frameRate: 30,
      frames: scene.anims.generateFrameNames("night-dead", {
        // prefix: "",
        // suffix: "",
        start: 0,
        end: 9,
        zeroPad: 2,
      }),
      repeat: 0,
    });
  }

  createAnimation_idle() {
    const scene = this.enemy.scene;

    scene.anims.create({
      key: "night-idle",
      frameRate: 30,
      frames: scene.anims.generateFrameNames("night-idle", {
        // prefix: "",
        // suffix: "",
        start: 0,
        end: 9,
        zeroPad: 2,
      }),
      repeat: -1,
    });
  }

  createAnimation_attack() {
    const scene = this.enemy.scene;

    scene.anims.create({
      key: "night-attack",
      frameRate: 30,
      frames: scene.anims.generateFrameNames("night-attack", {
        // prefix: "",
        // suffix: "",
        start: 0,
        end: 9,
        zeroPad: 2,
      }),
      repeat: -1,
    });
  }

  createAnimation_walk() {
    const scene = this.enemy.scene;

    scene.anims.create({
      key: "night-walk",
      frameRate: 30,
      frames: scene.anims.generateFrameNames("night-walk", {
        // prefix: "",
        // suffix: "",
        start: 0,
        end: 9,
        zeroPad: 2,
      }),
      repeat: -1,
    });
  }
}

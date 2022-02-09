import { enemies } from "../../../../../../helpers/vars";
import { EnemyAvatar } from "../../../../avatar";
import { SickEnemy } from "../sick-enemy";

export class SickEnemyAvatar extends EnemyAvatar {
  public avatar: any;
  public constructor( sickEnemy: SickEnemy ) {
    super(sickEnemy);
  }

  start() {
    const scene = this.enemy.scene;
    const container = this.enemy.container;

    this.createAnimation_walk();
    this.createAnimation_attack();

    this.avatar = scene.add.sprite(
      0,
      enemies.sickEnemy.visualExtraY,
      "sick-walk"
    );
    this.avatar.play("sick-walk");

    container.add(this.avatar);
    container.setDepth(enemies.sickEnemy.textureDepth);
  }

  createAnimation_walk() {
    const scene = this.enemy.scene;

    scene.anims.create({
      key: "sick-walk",
      frameRate: 30,
      frames: scene.anims.generateFrameNames("sick-walk", {
        // prefix: "",
        // suffix: "",
        start: 0,
        end: 23,
        zeroPad: 2,
      }),
      repeat: -1,
    });
  }

  createAnimation_attack() {
    const scene = this.enemy.scene;

    scene.anims.create({
      key: "sick-attack",
      frameRate: 30,
      frames: scene.anims.generateFrameNames("sick-attack", {
        // prefix: "",
        // suffix: "",
        start: 0,
        end: 11,
        zeroPad: 2,
      }),
      repeat: -1,
    });
  }
}

import { enemies } from "../../../../../../helpers/vars";
import { EnemyAvatar } from "../../../../../enemies/avatar";
import { EggEnemy } from "../egg-enemy";

export class EggEnemyAvatar extends EnemyAvatar {
  public avatar: any;
  public eggEnemy: EggEnemy;
  public constructor( enemy: EggEnemy ) {
    super(enemy);
    this.eggEnemy = enemy;
  }

  start() {
    const scene = this.eggEnemy.scene;
    const container = this.eggEnemy.container;

    this.createAnimation_avoid();
    this.createAnimation_attack();

    this.avatar = scene.add.sprite(
      0,
      enemies.eggEnemy.visualExtraY,
      "egg-thrower-avoid"
    );
    if(this.eggEnemy.isSmall) {
      this.avatar.setScale(enemies.eggEnemy.smallEnemyAvatarScale);
      this.avatar.y = enemies.eggEnemy.smallEnemyExtraTextureY;
    }
    this.avatar.play("egg-thrower-avoid");

    container.add(this.avatar);
    container.setDepth(enemies.eggEnemy.textureDepth);
  }

  createAnimation_avoid() {
    const scene = this.eggEnemy.scene;

    scene.anims.create({
      key: "egg-thrower-avoid",
      frameRate: 30,
      frames: scene.anims.generateFrameNames("egg-thrower-avoid", {
        // prefix: "",
        // suffix: "",
        start: 0,
        end: 59,
        zeroPad: 2,
      }),
      repeat: -1,
    });
  }

  createAnimation_attack() {
    const scene = this.eggEnemy.scene;

    scene.anims.create({
      key: "egg-thrower-attack",
      frameRate: enemies.eggEnemy.attackFrameRate,
      frames: scene.anims.generateFrameNames("egg-thrower-attack", {
        // prefix: "",
        // suffix: "",
        start: 0,
        end: 59,
        zeroPad: 2,
      }),
      repeat: -1,
    });
  }
}

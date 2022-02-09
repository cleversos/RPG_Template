import { enemies, logColors } from "../../../../../../helpers/vars";
import { EnemyAvatar } from "../../../../../enemies/avatar";
import { OceanEnemy } from "../ocean-enemy";

export const animationNames = {
  IDLE: "ocean-idle",
  WALK: "ocean-walk",
  ATTACK: "ocean-attack"
};

export class OceanEnemyAvatar extends EnemyAvatar {
  public avatar: any;
  public oceanEnemy: OceanEnemy;
  public constructor( enemy: OceanEnemy ) {
    super(enemy);
    this.oceanEnemy = enemy;
  }

  start() {
    const scene = this.oceanEnemy.scene;
    const container = this.oceanEnemy.container;

    this.createAnimation_idle();
    this.createAnimation_walk();
    this.createAnimation_attack();

    this.avatar = scene.add.sprite(
      0,
      enemies.oceanEnemy.visualExtraY,
      animationNames.IDLE
    );

    container.add(this.avatar);
    container.setDepth(enemies.oceanEnemy.textureDepth);
  }

  createAnimation_idle() {
    const scene = this.oceanEnemy.scene;

    scene.anims.create({
      key: animationNames.IDLE,
      frameRate: 30,
      frames: scene.anims.generateFrameNames(animationNames.IDLE, {
        // prefix: "",
        // suffix: "",
        start: 0,
        end: 23,
        zeroPad: 2,
      }),
      repeat: -1,
    });
  }

  createAnimation_walk() {
    const scene = this.oceanEnemy.scene;

    scene.anims.create({
      key: animationNames.WALK,
      frameRate: 30,
      frames: scene.anims.generateFrameNames(animationNames.WALK, {
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
    const scene = this.oceanEnemy.scene;

    scene.anims.create({
      key: animationNames.ATTACK,
      frameRate: enemies.oceanEnemy.attackFrameRate,
      frames: scene.anims.generateFrameNames(animationNames.ATTACK, {
        // prefix: "",
        // suffix: "",
        start: 0,
        end: 15,
        zeroPad: 2,
      }),
    });
  }

  public playAnimation(animationName: string) {
    if(enemies.oceanEnemy.isLogAnimatedPlayed) console.log('%cEnemy ' + this.enemy.name + ' %cis playing animation ' + animationName, enemies.oceanEnemy.logColor, logColors.animation);

    this.avatar.play(animationName);
  }
}

import { <FTName | pascalcase>Enemy } from "../<FTName | paramcase>-enemy";

export const <FTName | camelCase>_animationNames = {
  IDLE: "ocean-idle",
  // IDLE: "<FTName | paramcase>-idle",
  // WALK: "<FTName | paramcase>-walk",
  // ATTACK: "<FTName | paramcase>-attack"
};

export class <FTName | pascalcase>EnemyAvatar extends EnemyAvatar {
  public avatar: any;
  public <FTName | camelcase>Enemy: <FTName | pascalcase>Enemy;
  public constructor( enemy: <FTName | pascalcase>Enemy ) {
    super(enemy);
    this.<FTName | camelcase>Enemy = enemy;
  }

  start() {
    const scene = this.<FTName | camelcase>Enemy.scene;
    const container = this.<FTName | camelcase>Enemy.container;

    this.createAnimation_idle();

    this.avatar = scene.add.sprite(
      0,
      0,
      <FTName | camelCase>_animationNames.IDLE
    );

    container.add(this.avatar);
    container.setDepth(0);
  }

  createAnimation_idle() {
    const scene = this.<FTName | camelcase>Enemy.scene;

    scene.anims.create({
      key: <FTName | camelCase>_animationNames.IDLE,
      frameRate: 30,
      frames: scene.anims.generateFrameNames(<FTName | camelCase>_animationNames.IDLE, {
        // prefix: "",
        // suffix: "",
        start: 0,
        end: 23,
        zeroPad: 2,
      }),
      repeat: -1,
    });
  }

  public playAnimation(animationName: string) {
    // Optionally log the animation played.
    // console.log('%cEnemy ' + this.enemy.name + ' %cis playing animation ' + animationName, enemies.<FTName | camelcase>.logColor, logColors.animation);

    this.avatar.play(animationName);
  }
}

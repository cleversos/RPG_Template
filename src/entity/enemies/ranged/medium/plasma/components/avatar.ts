import { EnemyAvatar } from "../../../../avatar";
import { PlasmaEnemy } from "../plasma-enemy";

export const plasma_animationNames = {
  IDLE: "plasma-enemy_idle",
  RUN: "plasma-enemy_run",
  ATTACK: "plasma-enemy_attack"
};

export class PlasmaEnemyAvatar extends EnemyAvatar {
  public avatar: any;
  public plasmaEnemy: PlasmaEnemy;
  public stateText: Phaser.GameObjects.Text;
  public constructor(enemy: PlasmaEnemy) {
    super(enemy);
    this.plasmaEnemy = enemy;
  }

  start() {
    const scene = this.plasmaEnemy.scene;
    const container = this.plasmaEnemy.container;

    this.createAnimation_idle();
    this.createAnimation_run();
    this.createAnimation_attack();

    this.avatar = scene.add.sprite(
      0,
      -37,
      plasma_animationNames.IDLE
    );

    this.stateText = scene.add.text(0, -80, "STATE", { color: "white", fontSize: "30px", shadow: { offsetX: 1, offsetY: 1, fill: true } })
      .setOrigin(0.5, 0.5)
      .setAlpha(0);

    container.add(this.avatar);
    container.add(this.stateText);
    container.setDepth(0);
  }

  createAnimation_idle() {
    const scene = this.plasmaEnemy.scene;

    scene.anims.create({
      key: plasma_animationNames.IDLE,
      frameRate: 30,
      frames: scene.anims.generateFrameNames(plasma_animationNames.IDLE, {
        // prefix: "",
        // suffix: "",
        start: 0,
        end: 23,
        zeroPad: 2,
      }),
      repeat: -1,
    });
  }

  createAnimation_run() {
    const scene = this.plasmaEnemy.scene;

    scene.anims.create({
      key: plasma_animationNames.RUN,
      frameRate: 30,
      frames: scene.anims.generateFrameNames(plasma_animationNames.RUN, {
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
    const scene = this.plasmaEnemy.scene;

    scene.anims.create({
      key: plasma_animationNames.ATTACK,
      frameRate: 30,
      frames: scene.anims.generateFrameNames(plasma_animationNames.ATTACK, {
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
    // console.log('%cEnemy ' + this.enemy.name + ' %cis playing animation ' + animationName, enemies.plasma.logColor, logColors.animation);

    this.avatar.play(animationName);
  }

  public setStateText(text: string, color: string) {
    this.stateText.setText(text);
    this.stateText.setStyle({ color: color, fontSize: "30px", shadow: { offsetX: 1, offsetY: 1, fill: true } });
  }
}

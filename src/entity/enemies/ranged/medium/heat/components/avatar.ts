import { EnemyAvatar } from "../../../../avatar";
import { HeatEnemy } from "../heat-enemy";

export const heat_animationNames = {
  IDLE: "heat-idle",
  RUN: "heat-run",
  ATTACK: "heat-attack"
};

export class HeatEnemyAvatar extends EnemyAvatar {
  public avatar: any;
  public heatEnemy: HeatEnemy;
  public stateText: Phaser.GameObjects.Text;
  public constructor(enemy: HeatEnemy) {
    super(enemy);
    this.heatEnemy = enemy;
  }

  start() {
    const scene = this.heatEnemy.scene;
    const container = this.heatEnemy.container;

    this.createAnimation_idle();
    this.createAnimation_run();
    this.createAnimation_attack();

    this.avatar = scene.add.sprite(
      0,
      -43,
      heat_animationNames.IDLE
    );

    this.stateText = scene.add.text(0, -80, "STATE", { color: "white", fontSize: "30px", shadow: { offsetX: 1, offsetY: 1, fill: true } })
      .setOrigin(0.5, 0.5)
      .setAlpha(0);

    container.add(this.avatar);
    container.add(this.stateText);
    container.setDepth(0);
  }

  createAnimation_idle() {
    const scene = this.heatEnemy.scene;

    scene.anims.create({
      key: heat_animationNames.IDLE,
      frameRate: 30,
      frames: scene.anims.generateFrameNames(heat_animationNames.IDLE, {
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
    const scene = this.heatEnemy.scene;

    scene.anims.create({
      key: heat_animationNames.RUN,
      frameRate: 30,
      frames: scene.anims.generateFrameNames(heat_animationNames.RUN, {
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
    const scene = this.heatEnemy.scene;

    scene.anims.create({
      key: heat_animationNames.ATTACK,
      frameRate: 30,
      frames: scene.anims.generateFrameNames(heat_animationNames.ATTACK, {
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
    // console.log('%cEnemy ' + this.enemy.name + ' %cis playing animation ' + animationName, enemies.heat.logColor, logColors.animation);

    this.avatar.play(animationName);
  }

  public setStateText(text: string, color: string) {
    this.stateText.setText(text);
    this.stateText.setStyle({ color: color, fontSize: "30px", shadow: { offsetX: 1, offsetY: 1, fill: true } });
  }
}

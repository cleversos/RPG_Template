import { GameCore } from "../../core/game";
import { MainScene } from "../../scene/main-scene";
import { Entity } from "../entity";
import { HeartsComponent } from "./components/hearts";
import { SkillsComponents } from "./components/skills";
import { StaminaComponent } from "./components/stamina";
import { WordsComponent } from "./components/words";

export class Hud extends Entity {
  public heart: number = 10;
  public container: Phaser.GameObjects.Container;

  public pointsText: Phaser.GameObjects.Text;
  public timerText: Phaser.GameObjects.Text;
  heartDelay: number = 500;

  public heartsImage: Map<number, Phaser.GameObjects.Image> = new Map();
  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene
  ) {
    super();
    this.container = scene.add.container(x, y);
    this.container.update = () => this.update();
    this.container.setScrollFactor(0);

    this._initComponents();

    this.awake();
    this.start();

    scene.entity.add(this.container);
  }

  private _initComponents() {
    this.addComponent("hearts", new HeartsComponent(this));
    this.addComponent("stamina", new StaminaComponent(this));
    this.addComponent("skills", new SkillsComponents(this));
    this.addComponent("words", new WordsComponent(this));
  }

  public awake() {
    this.pointsText = this.scene.add
      .text(1850, 20, GameCore.points.toString(), {
        color: "#FFD600",
        fontFamily: "Roboto",
        fontSize: "60px",
      })
      .setOrigin(1, 0);
    if (this.scene.key === "game-scene") {
      this.timerText = this.scene.add
        .text(1850, 90, "Time : " + (GameCore.waveTimer / 1000).toString(), {
          color: "#FFD600",
          fontFamily: "Roboto",
          fontSize: "30px",
        })
        .setOrigin(1, 0);

      const waveText = this.scene.add
        .text(
          Math.floor(1920 / 2),
          300,
          `- WAVE ${
            GameCore.waveCount < 10
              ? "0" + GameCore.waveCount
              : GameCore.waveCount
          } -`,
          {
            fontFamily: "Roboto",
            fontStyle: "lighter",
            color: "#ffffff",
          }
        )
        .setDepth(15)
        .setOrigin(0.5)
        .setFontSize(120)
        .setScrollFactor(0)
        .setAlpha(0);

      this.scene.tweens.add({
        targets: [waveText],
        y: 200,
        alpha: 1,
        duration: 800,
        onComplete: () => {
          this.scene.time.delayedCall(1000, () => {
            this.scene.tweens.add({
              targets: [waveText],
              y: 100,
              alpha: 0,
              duration: 800,
              onComplete: () => {
                waveText.destroy();
              },
            });
          });
        },
      });

      this.container.add(this.timerText);
    }

    this.container.add(this.pointsText);
    this.container.setDepth(15);

    super.awake();
  }

  public update() {
    if (this.timerText) {
      this.timerText.setText(
        "Time : " + Math.floor(GameCore.waveTimer / 1000).toString()
      );
      this.timerText.setAlpha(0);

      // GameCore.waveTimer -= 1000 / 80;
      if (GameCore.heart <= 0) {
        this.scene.scene.start("field-scene");
        GameCore.reset();
      }
    }

    this.pointsText.setText(GameCore.points.toString());

    super.update();
  }

  public destroy() {
    if (this.container) this.container.destroy();
    super.destroy();
  }

  public canCatchLetter: boolean = true;

  public catchLetter(letter: string) {
    const words: WordsComponent = this.getComponent<WordsComponent>("words");
    if (words) {
      words.addLetter(letter);
    }
    this.canCatchLetter = false;
  }
}

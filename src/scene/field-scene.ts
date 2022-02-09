import { Vec2 } from "planck-js";
import { AnimationObject } from "../animation/animation";
import { AnimationLoader } from "../animation/loader";
import { GameCore } from "../core/game";
import { Background } from "../entity/background/background";
import { Hud } from "../entity/hud/hud";
import { Tree } from "../entity/tree/tree";
import { UpgradeCard } from "../entity/upgrade-card/upgrade-card";
import { PlanckPhysics } from "../physic/planck";
import { PlanckPhaserAdapter } from "../physic/planck-phaser-adapter";
import { MainScene } from "./main-scene";
import { icons, decors, parts, buttons } from "./preload-assets";

const adapter = PlanckPhaserAdapter;

export class FieldScene extends MainScene {
  public resetPointsText: Phaser.GameObjects.Text;
  public resetPointsButton: Phaser.GameObjects.Rectangle;

  public constructor() {
    super("field-scene");
  }

  public async create() {
    await super.create();
    this.add
      .text(Math.floor(1920 / 2), 90, "The Fields")
      .setFontFamily("Salsa")
      .setFontSize(95)
      .setOrigin(0.5)
      .setDepth(6);

    this.resetPointsText = this.add
      .text(
        Math.floor(1920 / 2),
        160,
        `${GameCore.points} points remaning. Reset stars?`
      )
      .setFontFamily("Salsa")
      .setFontSize(25)
      .setColor("#FFB800")
      .setOrigin(0.5)
      .setDepth(6);

    const resetButton = this.add
      .rectangle(1920 / 2 + 57, 175, 140, 3, 0xffb800)
      .setDepth(6)
      .setOrigin(0);
    resetButton.setInteractive(
      new Phaser.Geom.Rectangle(0, -50, 140, 50),
      Phaser.Geom.Rectangle.Contains
    );
    this.resetPointsButton = resetButton;
    let resetButtonReleased = true;
    resetButton.on("pointerdown", () => {
      if (!resetButtonReleased) return;
      let points = 0;
      GameCore.upgrades.forEach((u) => {
        points += u.points * u.cost;
        u.points = 0;
      });
      GameCore.points += points;
      resetButtonReleased = false;
    });

    resetButton.on("pointerup", () => (resetButtonReleased = true));
    resetButton.input.cursor = "pointer";

    const cardTexture = this.textures.get("upgrade-card");
    const { width: cardWidth, height: cardHeight } = cardTexture.get(0);

    const offsetX = 20;
    const offsetY = 31;

    const cardsContainer = this.add
      .container(1920 / 2 - (cardWidth * 4 + offsetX * 4) / 2, 200)
      .setDepth(6);

    const cardsData = Array.from(GameCore.upgrades.entries());

    let gridX = 0;
    let gridY = 0;

    cardsData.forEach(([cardName, cardData]) => {
      const card = new UpgradeCard(
        cardWidth * gridX + offsetX * gridX,
        cardHeight * gridY + offsetY * gridY,
        cardName,
        this
      );
      cardsContainer.add(card.container);
      gridX += 1;
      if (gridX / 4 === 1) {
        gridX = 0;
        gridY += 1;
      }

      console.log(gridX, gridY);
    });

    // this.add
    //   .tileSprite(0, 942, 1920, 270, "decor-houses")
    //   .setOrigin(0, 1)
    //   .setDepth(-2)
    //   .setAlpha(0.2);

    const ground = this.add.image(0, 992 - 90, "decor-sol").setOrigin(0);
    const character = this.add
      .image(1920 / 2, 992 - 130, "decor-larger_character")
      .setScale(0.5)
      .setDepth(5);
    const bigLetterA = this.add
      .image(character.getBottomLeft().x - 130, 992 - 100, "decor-big-letter-1")
      .setDepth(5);
    const bigLetterB = this.add
      .image(character.getBottomLeft().x - 260, 992 - 100, "decor-big-letter-2")
      .setDepth(5);
    const bigLetterA2 = this.add
      .image(
        character.getBottomRight().x + 130,
        992 - 100,
        "decor-big-letter-1"
      )
      .setDepth(5);

    this.add.rectangle(0, 0, 1920, 992, 0x33771b).setOrigin(0).setAlpha(0.73);

    new Background(1920, 992 - 85, this, true);
    new Hud(30, 30, this);

    const nextWaveButton = this.add
      .image(1920 - 60, 980, "button-next-wave")
      .setOrigin(1)
      .setScale(0.5);
    nextWaveButton.setInteractive({ pointer: true });
    nextWaveButton.on("pointerover", () => {
      nextWaveButton.setAlpha(0.8);
    });
    nextWaveButton.on("pointerout", () => {
      nextWaveButton.setAlpha(1);
    });

    nextWaveButton.on("pointerdown", () => {
      this.scene.start("game-scene");
    });
  }

  update() {
    if (this.resetPointsText) {
      try {
        this.resetPointsText.setText(
          `${GameCore.points} points remaning. Reset stars?`
        );
        this.resetPointsButton.x = this.resetPointsText.getTopRight().x - 140;
        this.resetPointsButton.setOrigin(0, 0);
      } catch (e) {
        console.log(e);
      }
    }
    super.update();
  }
}

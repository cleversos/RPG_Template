import { Background } from "../entity/background/background";
import { Hud } from "../entity/hud/hud";
import { MainScene } from "./main-scene";

export class WaveEndScene extends MainScene {
  constructor() {
    super("wave-end-scene");
  }

  public async create() {
    super.create();
    this.add
      .text(Math.floor(1920 / 2), 90, "Choose wisely")
      .setFontFamily("Salsa")
      .setFontSize(95)
      .setOrigin(0.5)
      .setDepth(6);

    const paragraph1 = this.add
      .text(
        Math.floor(1920 / 2),
        160,
        `Go to The Fields to recover but you’ll lose much of what you’ve earned. However, if you feel strong or continue to the next wave. The chose is always yours.`,
        {
          wordWrap: {
            width: 850,
          },
          align: "center",
        }
      )
      .setFontFamily("Salsa")
      .setFontSize(34)
      .setOrigin(0.5, 0)
      .setDepth(6);
    this.add
      .text(
        Math.floor(1920 / 2),
        paragraph1.getBottomLeft().y,
        `Just don't regret it.`,
        {
          wordWrap: {
            width: 850,
          },
          align: "center",
        }
      )
      .setFontFamily("Salsa")
      .setFontSize(34)
      .setOrigin(0.5, 0)
      .setDepth(6);

    const cardTexture = this.textures.get("upgrade-card");
    const { width: cardWidth, height: cardHeight } = cardTexture.get(0);

    const offsetX = 20;
    const offsetY = 31;

    const cardsContainer = this.add
      .container(1920 / 2 - (cardWidth * 4 + offsetX * 4) / 2, 200)
      .setDepth(6);

    const ground = this.add.image(0, 992 - 90, "decor-sol").setOrigin(0);
    const character = this.add
      .image(1920 / 2, 992 - 100, "decor-larger_character_wave_end")
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
      .image(Math.floor(1920 / 2), 490, "button-next-wave")
      .setOrigin(0, 0.5)
      .setScale(0.7);

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

    const fieldsButton = this.add
      .image(Math.floor(1920 / 2), 490, "button-fields")
      .setOrigin(1, 0.5)
      .setScale(0.47);

    fieldsButton.setInteractive({ pointer: true });
    fieldsButton.on("pointerover", () => {
      fieldsButton.setAlpha(0.8);
    });
    fieldsButton.on("pointerout", () => {
      fieldsButton.setAlpha(1);
    });
    fieldsButton.on("pointerdown", () => {
      this.scene.start("field-scene");
    });
  }
}

import { AnimationObject } from "../animation/animation";
import { GameCore } from "../core/game";
import { Background } from "../entity/background/background";
import { enemies } from "../helpers/vars";
import { MainScene } from "./main-scene";

let gameInitialized: boolean = false;
export class HomeScene extends MainScene {
  constructor() {
    super("home-scene");
  }

  async create() {
    await super.create();

    // if 'IS_ENEMIES_TEST_BED_SCENE' is true, then only load enemies test bed scene and ignore proceeding code
    if (enemies.IS_ENEMIES_TEST_BED_SCENE) {
      console.log("IS_ENEMIES_TEST_BED_SCENE is true.");
      this.scene.start("enemies-test-bed-scene");
      return;
    }

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

    const logo = this.add
      .image(1920 / 2, 0, "decor-logo")
      .setOrigin(0.5, 0)
      .setScale(0.5);

    new Background(1920, 992 - 85, this, true);

    const playButton = this.add
      .image(1920 / 2, logo.getBottomCenter().y - 40, "button-play")
      .setOrigin(0.5, 0)
      .setScale(1);
    playButton.setInteractive({ cursor: "pointer", pixelPerfect: true });
    playButton.on("pointerover", () => {
      playButton.setAlpha(0.8);
    });
    playButton.on("pointerout", () => {
      playButton.setAlpha(1);
    });
    playButton.on("pointerdown", () => {
      this.scene.start("field-scene");
    });
  }
}

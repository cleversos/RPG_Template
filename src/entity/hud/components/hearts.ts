import { GameCore } from "../../../core/game";
import { MainScene } from "../../../scene/main-scene";
import { EntityComponent } from "../../entity";
import { Hud } from "../hud";

export class HeartsComponent extends EntityComponent {
  public scene: MainScene;
  public container: Phaser.GameObjects.Container;
  public heartContainer: Phaser.GameObjects.Container;
  public heart: number;
  public heartsImage: Map<number, Phaser.GameObjects.Image> = new Map();

  public constructor(public parent: Hud) {
    super();
    this.scene = parent.scene;
    this.container = parent.container;
    this.heartContainer = parent.scene.add.container(0, 0);
    this.heart = GameCore.heart;
  }

  public start() {
    this.initHeart();
  }

  public update() {
    this.updateHeart();
  }

  public initHeart() {
    const scene = this.scene;
    const container = this.container;
    const heartContainer = this.heartContainer;
    const { width: heartWidth, height: heartHeight } = scene.textures
      .get("icon-heart-full")
      .get(0);

    let heartCount = (this.heart = GameCore.heart);
    let filledHeart = 0;
    let halfHeart = 0;

    while (heartCount > 0) {
      if (heartCount >= 2) {
        filledHeart += 1;
        heartCount -= 2;
      } else if (heartCount == 1) {
        halfHeart += 1;
        heartCount -= 1;
      }
    }

    let voidHeart = 5 - (filledHeart + halfHeart);

    for (let i = 0; i < 5; i += 1) {
      let texture: string = "";
      if (filledHeart > 0) {
        texture = "icon-heart-full";
        filledHeart -= 1;
      } else if (halfHeart > 0) {
        texture = "icon-heart-half";
        halfHeart -= 1;
      } else {
        texture = "icon-heart-zero";
        voidHeart -= 1;
      }
      const heartImage = scene.add
        .image(i * heartWidth, heartHeight / 2, texture)
        .setOrigin(0, 0.5);
      heartContainer.add(heartImage);

      this.heartsImage.set(i, heartImage);
    }
    this.container.add(heartContainer);
  }

  public updateHeart() {
    let heartCount = (this.heart = GameCore.heart);
    let filledHeart = 0;
    let halfHeart = 0;

    while (heartCount > 0) {
      if (heartCount >= 2) {
        filledHeart += 1;
        heartCount -= 2;
      } else if (heartCount == 1) {
        halfHeart += 1;
        heartCount -= 1;
      }
    }

    let voidHeart = 5 - (filledHeart + halfHeart);

    for (let i = 0; i < 5; i += 1) {
      let texture: string = "";
      if (filledHeart > 0) {
        texture = "icon-heart-full";
        filledHeart -= 1;
      } else if (halfHeart > 0) {
        texture = "icon-heart-half";
        halfHeart -= 1;
      } else {
        texture = "icon-heart-zero";
        voidHeart -= 1;
      }
      const heartImage = this.heartsImage.get(i);
      if (heartImage) {
        heartImage.setTexture(texture);
      }
    }
  }
}

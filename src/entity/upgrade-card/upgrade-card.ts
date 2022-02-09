import { GameCore } from "../../core/game";
import { Upgrade } from "../../core/upgrade";
import { MainScene } from "../../scene/main-scene";
import { Entity } from "../entity";

export class UpgradeCard extends Entity {
  public data: Upgrade;
  public container: Phaser.GameObjects.Container;
  public stars: Phaser.GameObjects.Image;

  public cost: Phaser.GameObjects.Text;

  public constructor(
    public x: number,
    public y: number,
    public name: string,
    public scene: MainScene
  ) {
    super();
    const upgrade: Upgrade = GameCore.upgrades.get(name);
    const container: Phaser.GameObjects.Container = scene.add.container(x, y);

    container.update = () => {
      this.update();
    };

    this.container = container;
    this.data = upgrade;

    if (upgrade.unlocked) this._initCard();
    else {
      this._initLockedCard();
    }
    this.awake();
    this.start();

    scene.entity.add(container);
  }

  private _initLockedCard() {
    const scene = this.scene;
    const container = this.container;

    const background = scene.add.image(0, 0, "upgrade-card").setOrigin(0);
    const text = scene.add
      .text(
        background.width / 2,
        background.height / 2,
        "Ability Locked".toUpperCase(),
        {
          fontFamily: "Roboto",
          fontStyle: "bold",
          fontSize: "28px",
          align: "center",
          wordWrap: {
            width: 120,
          },
        }
      )
      .setOrigin(0.5);
    background.setTint(0xf4bb40);
    container.add(background);
    container.add(text);
  }

  private _initCard() {
    const scene = this.scene;
    const container = this.container;

    const background = scene.add.image(0, 0, "upgrade-card").setOrigin(0);
    const text = scene.add
      .text(0, 0, this.name.toUpperCase(), {
        fontFamily: "Roboto",
        color: "#000",
        fontStyle: "bold",
        fontSize: "28px",
      })
      .setOrigin(0.5, 1);
    const cost = scene.add
      .text(0, 0, this.data.cost + "", {
        fontSize: "27px",
        fontFamily: "Roboto",
        fontStyle: "bold",
        color: "#FFB800",
      })
      .setOrigin(0.5);

    cost.y = 35;

    this.cost = cost;

    const stars = scene.add.image(0, 0, "icon-star-0").setOrigin(0.5, 1);
    const icon = scene.add.image(0, 82, `icon-${this.name}`);

    icon.setScale(0.7);

    icon.x = stars.x = text.x = cost.x = background.width / 2;
    icon.y = 82 + 20;

    stars.y = background.height - 10;
    text.y = stars.getTopCenter().y;

    container.add(background);
    container.add(text);
    container.add(cost);
    container.add(icon);
    container.add(stars);

    container.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, background.width, background.height),
      Phaser.Geom.Rectangle.Contains
    );
    container.input.cursor = "pointer";

    this.stars = stars;

    container.on("pointerdown", this.onClick.bind(this));
  }

  public onClick(
    point: Phaser.Input.Pointer,
    localX: number,
    localY: number,
    event: Event
  ) {
    if (GameCore.points >= this.data.cost) {
      if (this.data.points < 3) {
        this.data.points += 1;
        GameCore.points -= this.data.cost;
      } else {
        GameCore.points += 3 * this.data.cost;
        this.data.points = 0;
      }
    }

    this._updateStars();
  }

  private _updateStars() {
    if (this.cost) {
      if (this.data.points === 3) this.cost.setAlpha(0);
      else this.cost.setAlpha(1);
    }
    if (this.stars) this.stars.setTexture(`icon-star-${this.data.points}`);
  }

  public destroy() {
    if (this.container) this.container.destroy();
    super.destroy();
  }

  public update() {
    this._updateStars();
  }
}

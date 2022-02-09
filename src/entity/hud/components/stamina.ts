import { GameCore } from "../../../core/game";
import { MainScene } from "../../../scene/main-scene";
import { EntityComponent } from "../../entity";
import { Hud } from "../hud";

export class StaminaComponent extends EntityComponent {
  public scene: MainScene;
  public container: Phaser.GameObjects.Container;
  public energyContainer: Phaser.GameObjects.Container;
  public energyMask: Phaser.GameObjects.Image;
  public constructor(public parent: Hud) {
    super();
    this.scene = parent.scene;
    this.container = parent.container;
    this.energyContainer = parent.scene.add.container(0, 60);
  }

  public start() {
    this.initStaminaBar();
  }

  public update() {
    this.energyMask.x = this.container.x + this.energyContainer.x;
    this.energyMask.y = this.container.y + this.energyContainer.y;

    const width = this.energyMask.width;
    const energyOffset = (width * GameCore.stamina) / 100;

    this.energyMask.x += energyOffset;

    if (GameCore.stamina + (10 * 1) / 80 < 100) {
      GameCore.stamina += (10 * 1) / 80;
    } else {
      GameCore.stamina = 100;
    }
  }

  public initStaminaBar() {
    const scene = this.scene;
    const container = this.container;
    const energyContainer = this.energyContainer;

    const whiteBar = scene.add.image(0, 0, "part-bar-white").setOrigin(0);
    const yellowBar = scene.add.image(0, 0, "part-bar-yello").setOrigin(0);

    const barMask = scene.make
      .image({
        x: 0,
        y: 0,
        key: "part-bar-white",
        add: false,
      })
      .setOrigin(1, 0)
      .setScrollFactor(0);

    // hudContainer.add(barMask);
    const whiteBarMask = new Phaser.Display.Masks.BitmapMask(scene, barMask);
    yellowBar.mask = whiteBarMask;

    this.energyContainer = energyContainer;
    this.energyMask = barMask;
    energyContainer.add([whiteBar, yellowBar]);

    container.add(energyContainer);
  }
}

import { BaseLevel } from ".";
import { LayerElement } from "./utils";
// const objectsLayers = data.getObjectLayerNames();

export class TiledLevel extends BaseLevel {
  public ambianceSound: Phaser.Sound.BaseSound;
  constructor(public scene: Phaser.Scene, public key: string) {
    super(scene);
    this.loadImages();
    // this.build();
  }

  protected loadImages = async () => {
    if (!this._tiledMapExist()) return;
    const data = this.scene.make.tilemap({ key: this.key });
    const tilesets = data.imageCollections[0];
    if (!tilesets) return;

    await new Promise((res, rej) => {
      if (!this.scene.textures.exists(`${this.key}-atlas`)) {
        this.scene.load.atlas(
          `${this.key}-atlas`,
          `/assets/map/assets/${this.key.replace("map-", "")}/atlas.png`,
          `/assets/map/assets/${this.key.replace("map-", "")}/atlas.json`
        );
      }
      this.scene.load.once("complete", () => res(true));
      this.scene.load.start();
    });
    this.build();
    this.emitter.emit("map-ready");
  };

  protected build = () => {
    if (!this._tiledMapExist()) return;
    const skyGradient = this.scene.add.graphics();
    skyGradient.setDepth(-100);

    skyGradient.fillGradientStyle(0x396aeb, 0x396aeb, 0xa1c1fb, 0xa1c1fb, 1);
    skyGradient.fillRect(0, 0, 960, 430);
    const data = this.scene.make.tilemap({ key: this.key });
    const objectsLayers = data.getObjectLayerNames();

    const collisionsLayer =
      objectsLayers.indexOf("collisions") !== -1
        ? data.getObjectLayer("collisions")
        : null;
    const imagesLayer =
      objectsLayers.indexOf("images") !== -1
        ? data.getObjectLayer("images")
        : null;

    if (collisionsLayer) this.buildCollisions(collisionsLayer);
    if (imagesLayer) this.renderMapImages(imagesLayer);
    this.ambianceSound = this.scene.sound.add("ambiance-plaine", {
      loop: true,
      volume: 0.2,
    });
    this.ambianceSound.play();

    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.ambianceSound.stop();
    });
  };

  protected renderMapImages(layer: Phaser.Tilemaps.ObjectLayer) {
    layer.objects.reverse().forEach((img, id) => {
      const image = this.scene.add
        .image(img.x, img.y, `${this.key}-atlas`, `${img.gid}`)
        .setOrigin(0, 1);
      const layerElement = new LayerElement(img);
      image.setDepth(-id);
      const depth = layerElement.getProperty<number>("depth");
      const alpha = layerElement.getProperty<number>("alpha");
      if (depth !== undefined) {
        image.setDepth(depth);
      }
      if (alpha !== undefined) {
        image.setAlpha(alpha);
      }
    });
  }

  protected buildCollisions(layer: Phaser.Tilemaps.ObjectLayer) {
    layer.objects.forEach((o) => {
      const layerElement = new LayerElement(o);
      const body = this.builder.buildCollision(layerElement);
    });
  }

  private _tiledMapExist(): boolean {
    return this.scene.cache.tilemap.exists(this.key);
  }
}

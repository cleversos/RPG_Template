import { MainScene } from "../../scene/main-scene";
import { Entity } from "../entity";

export class House extends Entity {
  public container: Phaser.GameObjects.Container;
  public constructor(
    public x: number,
    public y: number,
    public stage: number,
    public scene: MainScene
  ) {
    super();
    this.container = scene.add.container(x, y);
    this.container.update = () => this.update();

    this.awake();
    this.start();

    scene.entity.add(this.container);
  }

  public awake() {
    const scene = this.scene;
    const container = this.container;
    const baseTexture = scene.textures.get("part-house-door");
    const bodyTexture = scene.textures.get("part-house-body");
    const headTexture = scene.textures.get("part-house-head");

    let y = 0;
    for (let i = 0; i < this.stage; i += 1) {
      const texture =
        i === 0
          ? baseTexture
          : i > 0 && i + 1 !== this.stage
          ? bodyTexture
          : headTexture;
      const part = scene.add.image(0, y, texture.key).setOrigin(0.5, 1);

      y +=
        texture === baseTexture
          ? -part.height / 2.5
          : texture === bodyTexture && i + 1 !== this.stage
          ? -part.height / 1.6
          : -part.height / 2;
      container.add(part);
    }

    // container.add(scene.add.rectangle(0, 0, 20, 20, 0xff0000));

    super.awake();
  }
}

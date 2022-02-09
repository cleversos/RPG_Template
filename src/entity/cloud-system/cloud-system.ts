import { MainScene } from "../../scene/main-scene";
import { Entity } from "../entity";

export class CloudSystem extends Entity {
  public container: Phaser.GameObjects.Container;
  public plans: Map<string, Phaser.GameObjects.Container> = new Map();

  public cloudDelay: number = 0;

  public cloudMinTime: number = 35000;
  public cloudMaxTime: number = 20000;

  public cloudSpawnMax: number = 2;

  public constructor(public scene: MainScene) {
    super();
    this.container = scene.add.container(0, 0);
    this.container.update = () => this.update();
    this.awake();
    this.start();

    scene.entity.add(this.container);
  }

  public awake() {
    const scene = this.scene;

    const mountainSmall = scene.textures.get("part-mountain-small");
    const mountainLarge = scene.textures.get("part-mountain-large");

    scene.add
      .image(300, 950, mountainLarge.key)
      .setOrigin(0.5, 1)
      .setDepth(-11);

    scene.add
      .image(700, 1100, mountainLarge.key)
      .setOrigin(0.5, 1)
      .setDepth(-12);

    scene.add
      .image(1620, 950, mountainLarge.key)
      .setOrigin(0.5, 1)
      .setDepth(-11)
      .setFlipX(true);

    scene.add
      .image(1300, 950, mountainSmall.key)
      .setOrigin(0.5, 1)
      .setDepth(-13);

    scene.add
      .image(1000, 950, mountainSmall.key)
      .setOrigin(0.5, 1)
      .setDepth(-13);

    this.spawnClouds(true);
    this.cloudDelay =
      this.cloudMinTime + Math.floor(Math.random() * this.cloudMaxTime);

    super.awake();
  }

  public spawnClouds(init?: boolean) {
    const scene = this.scene;
    const cloud1 = scene.textures.get("part-cloud-1");
    const cloud2 = scene.textures.get("part-cloud-2");
    const cloud3 = scene.textures.get("part-cloud-3");

    const clouds = [cloud1, cloud2, cloud3];

    let cloudsCount = 1 + Math.floor(Math.random() * this.cloudSpawnMax);
    let minX = init ? 200 : 1950;
    let maxX = init ? 1800 : 200;

    let minY = 0;
    let maxY = 600;
    let targetX = -200;

    let maxDepth = -8;
    let minDepth = -11;

    for (let i = 0; i < cloudsCount; i += 1) {
      let cloudX = minX + Math.floor(Math.random() * maxX);
      let cloudY = minY + Math.floor(Math.random() * maxY);

      let cloudTexture = clouds[Math.floor(Math.random() * clouds.length)];
      let depth = minDepth + Math.floor(Math.random() * 7) * -1;

      let cloud = scene.add
        .image(cloudX, cloudY, cloudTexture.key)
        .setScrollFactor(0.5)
        .setOrigin(0)
        .setDepth(depth);
      console.log((cloudX - targetX) / ((20 + Math.random() * 30) / 1000));
      scene.tweens.add({
        targets: [cloud],
        x: targetX,
        duration: (cloudX - targetX) / ((20 + Math.random() * 30) / 1000),
        onComplete: () => {
          scene.tweens.add({
            targets: [cloud],
            x: targetX - 200,
            duration: (cloudX - targetX) / ((20 + Math.random() * 30) / 1000),
            alpha: 0,
            onComplete: () => {
              cloud.destroy();
            },
          });
        },
      });
    }
  }

  public update() {
    if (this.cloudDelay <= 0) {
      this.spawnClouds();
      this.cloudDelay =
        this.cloudMinTime + Math.floor(Math.random() * this.cloudMaxTime);
    } else {
      this.cloudDelay -= 1000 / 60;
    }
    super.update();
  }
}

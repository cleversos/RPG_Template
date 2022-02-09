import { MainScene } from "../../scene/main-scene";
import { CloudSystem } from "../cloud-system/cloud-system";
import { Entity } from "../entity";
import { House } from "../house/house";
import { Tree } from "../tree/tree";

const leafTextures = ["leaf-half-circle", "leaf-heart", "leaf-normal"];

export class Background extends Entity {
  public housesPlans: Map<number, [number, () => boolean]> = new Map();
  public container: Phaser.GameObjects.Container;
  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene,
    public clouds: boolean = false
  ) {
    super();
    this.container = scene.add.container(x, y);
    this.container.update = () => this.update();
    // if (clouds) new CloudSystem(scene);
    this.awake();
    this.start();

    scene.entity.add(this.container);
    this.housesPlans;
  }

  public awake() {
    const scene = this.scene;
    this.housesPlans.set(-1, [
      1,
      () => {
        let hasTree = Math.random() * 1 > 0.8;
        return hasTree;
      },
    ]);
    this.housesPlans.set(-5, [
      0.7,
      () => {
        return Math.random() * 1 > 0.1;
      },
    ]);
    this.housesPlans.set(-10, [
      0.5,
      () => {
        return Math.random() * 1 > 0.4;
      },
    ]);

    const containerSize = 1920 + 1400 + 700;
    const startX = -containerSize / 2;

    this.housesPlans.forEach(([scrollFactor, hasTree], depth) => {
      const container = scene.add.container(-700, this.y);
      const houseContainer = scene.add.container(0, 0);
      const treeContainer = scene.add.container(0, 0);

      container.add(houseContainer);
      container.add(treeContainer);
      let x = startX;

      container.setScrollFactor(scrollFactor);

      while (x < containerSize / 2) {
        // Spawn tree;

        let treeCount = 1 + Math.floor(Math.random() * 2);
        const stages = 1 + Math.floor(Math.random() * 3);
        const house = new House(x, 0, 1 + Math.floor(Math.random() * 3), scene);
        house.container.setScale(scrollFactor);
        houseContainer.add(house.container);

        if (hasTree()) {
          for (let i = 0; i < treeCount; i += 1) {
            let leaf =
              leafTextures[Math.floor(Math.random() * leafTextures.length)];

            let offset = (i + 1) * 30 + Math.random() * 300;
            let tree = new Tree(
              x + offset,
              10,
              1 + Math.floor(Math.random() * 2),
              "part-tree-" + leaf,
              scene
            );
            tree.container.setScale(1 - (Math.random() * 0.3 + 0.2));
            x = tree.x;
            treeContainer.add(tree.container);
          }

          x += 120 * scrollFactor;
        } else {
          x += 250 * scrollFactor;
        }

        container.setDepth(depth);
      }
    });

    super.awake();
  }

  public destroy() {
    if (this.container) this.container.destroy();
    super.destroy();
  }
}

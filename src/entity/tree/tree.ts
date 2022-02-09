import { MainScene } from "../../scene/main-scene";
import { Entity } from "../entity";

const leafsData: Map<string, number> = new Map();

leafsData.set("part-tree-leaf-normal", 2.5);
leafsData.set("part-tree-leaf-half-circle", 1.5);
leafsData.set("part-tree-leaf-heart", 2);

const leafColors = [
  0x15a873, 0x15a873, 0x15a873, 0x477721, 0x477721, 0x477721, 0x477721,
  0x57d079, 0x7a7122, 0x159fa8, 0xa84a15, 0x15a873,
];

export class Tree extends Entity {
  public container: Phaser.GameObjects.Container;
  public color: number;
  public branch: string;

  public constructor(
    public x: number,
    public y: number,
    public leafs: number,
    public leafTexture: string,
    public scene: MainScene
  ) {
    super();
    const container = scene.add.container(x, y);
    container.update = () => {
      this.update();
    };

    this.container = container;
    this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
    this.branch =
      Math.random() * 1 > 0.75
        ? "part-tree-branch-thick"
        : "part-tree-branch-normal";
    this._initTree();

    this.awake();
    this.start();

    scene.entity.add(container);
  }

  private _initTree() {
    const scene = this.scene;
    const container = this.container;

    let base = scene.add.image(0, 0, this.branch).setOrigin(0.5, 1);
    // base = scene.add.image(0, 0, "part-tree-branch-thick").setOrigin(0.5, 1);
    base.y = 0;

    container.add(base);
    for (let i = 0; i < this.leafs; i += 1) {
      const leafTexture = this.leafTexture;
      const leaf = scene.add.image(0, 0, leafTexture).setOrigin(0.5, 1);

      leaf.setTint(this.color);

      leaf.y =
        -base.height +
        leaf.height / 6 -
        (i * leaf.height) / leafsData.get(leafTexture);
      container.add(leaf);
    }

    // container.add(scene.add.rectangle(0, 0, 10, 10, 0xff0000));
  }

  public destroy() {
    if (this.container) this.container.destroy();
    super.destroy();
  }
}

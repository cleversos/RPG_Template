import { MainScene } from "../../../../../scene/main-scene";
import { MeleeEnemy } from "../../meleeEnemy";
import { CycleEnemyAvatar } from "./components/avatar";
import { CycleEnemyBody } from "./components/body";
import { CycleEnemyMovement } from "./components/movement";

let nameID = 0;

export class CycleEnemy extends MeleeEnemy {
  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene
  ) {
    super(x, y, scene);
    this.life = 10;
    this.name = "CycleEnemy_" + nameID;
    nameID += 1;

    this.initComponents();
    this.start();
    this.awake();

    scene.entity.add(this.container);
  }

  public destroy() {
    if (this.container) this.container.destroy();
    super.destroy();
  }

  public initComponents() {
    this.addComponent("avatar", new CycleEnemyAvatar(this));
    this.addComponent("body", new CycleEnemyBody(this));
    this.addComponent("movement", new CycleEnemyMovement(this));
  }
}

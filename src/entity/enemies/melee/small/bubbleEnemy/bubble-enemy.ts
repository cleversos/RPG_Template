import { MainScene } from "../../../../../scene/main-scene";
import { OceanEnemy } from "../../../ranged/small/oceanEnemy/ocean-enemy";
import { MeleeEnemy } from "../../meleeEnemy";
import { BubbleEnemyAvatar } from "./components/avatar";
import { BubbleEnemyBody } from "./components/body";
import { BubbleEnemyMovement } from "./components/movement";

let nameID = 0;

export class BubbleEnemy extends MeleeEnemy {
  public aimHeight: number;
  public aimPosition: number;
  public constructor(
    public x: number,
    public y: number,
    public direction: number,
    public scene: MainScene,
    public oceanEnemy: OceanEnemy
  ) {
    super(x, y, scene, direction);
    this.life = 10;
    this.name = "BubbleEnemy_" + nameID;
    nameID += 1;

    this.aimHeight = y - 200 + Math.floor(Math.random() * 50);

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
    this.addComponent("avatar", new BubbleEnemyAvatar(this));
    this.addComponent("body", new BubbleEnemyBody(this));
    this.addComponent("movement", new BubbleEnemyMovement(this));
  }
}

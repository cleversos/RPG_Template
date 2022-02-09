import { MainScene } from "../../../../../scene/main-scene";
import { MeleeEnemy } from "../../meleeEnemy";
import { SickEnemyAvatar } from "./components/avatar";
import { SickEnemyBody } from "./components/body";
import { SickEnemyMovement } from "./components/movement";

let sickEnemy_nameID = 0;

export class SickEnemy extends MeleeEnemy {
  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene,
  ) {
    super(x, y, scene);

    this.name = "SickEnemy_" + sickEnemy_nameID;
    this.life = 3;
    sickEnemy_nameID += 1;

    this.initComponents();
    this.start();
    this.awake();

    scene.entity.add(this.container);
  }

  public initComponents() {
    this.addComponent("avatar", new SickEnemyAvatar(this));
    this.addComponent("body", new SickEnemyBody(this));
    this.addComponent("movement", new SickEnemyMovement(this));
  }
}

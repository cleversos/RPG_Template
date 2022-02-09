import { enemies, logColors } from "../../../../../helpers/vars";
import { MainScene } from "../../../../../scene/main-scene";
import { RangedEnemy } from "../../rangedEnemy";
import { OceanEnemyAvatar } from "./components/avatar";
import { OceanEnemyBody } from "./components/body";
import { OceanEnemyMovement } from "./components/movement";

let oceanEnemy_nameID = 0;

export class OceanEnemy extends RangedEnemy {
  public currentBubblesActive = 0;

  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene,
  ) {
    super(x, y, scene);
    this.life = 3;
    this.name = "OceanEnemyLarge_" + oceanEnemy_nameID;
    oceanEnemy_nameID += 1;

    console.log('%cCreated enemy: ' + '%c' + this.name, logColors.create, enemies.oceanEnemy.logColor);

    this.initComponents();
    this.start();
    this.awake();

    scene.entity.add(this.container);
  }

  public initComponents() {
    this.addComponent("avatar", new OceanEnemyAvatar(this));
    this.addComponent("body", new OceanEnemyBody(this));
    this.addComponent("movement", new OceanEnemyMovement(this));
  }

  public modifyCurrentBubblesActive(value: number) {
    this.currentBubblesActive += value;
  }
}

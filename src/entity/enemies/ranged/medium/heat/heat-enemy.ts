import { enemies } from "../../../../../helpers/vars";
import { MainScene } from "../../../../../scene/main-scene";
import { RangedEnemy } from "../../rangedEnemy";
import { HeatEnemyAvatar } from "./components/avatar";
import { HeatEnemyBody } from "./components/body";
import { HeatEnemyMovement } from "./components/movement";

let heat_nameID = 0;

export class HeatEnemy extends RangedEnemy {
  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene,
  ) {
    super(x, y, scene);
    this.life = 10;
    this.name = "HeatEnemy_" + heat_nameID;
    heat_nameID += 1;

    // console.log('%cCreated enemy: ' + '%c' + this.name, logColors.create, enemies.heat.logColor);

    this.initComponents();
    this.start();
    this.awake();

    scene.entity.add(this.container);
  }

  public initComponents() {
    this.addComponent("avatar", new HeatEnemyAvatar(this));
    this.addComponent("body", new HeatEnemyBody(this));
    this.addComponent("movement", new HeatEnemyMovement(this));
  }
}

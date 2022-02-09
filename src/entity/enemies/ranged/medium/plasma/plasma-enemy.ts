import { enemies } from "../../../../../helpers/vars";
import { MainScene } from "../../../../../scene/main-scene";
import { RangedEnemy } from "../../rangedEnemy";
import { PlasmaEnemyAvatar } from "./components/avatar";
import { PlasmaEnemyBody } from "./components/body";
import { PlasmaEnemyMovement } from "./components/movement";

let plasma_nameID = 0;

export class PlasmaEnemy extends RangedEnemy {
  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene,
  ) {
    super(x, y, scene);
    this.life = 10;
    this.name = "PlasmaEnemy_" + plasma_nameID;
    plasma_nameID += 1;

    // console.log('%cCreated enemy: ' + '%c' + this.name, logColors.create, enemies.plasma.logColor);

    this.initComponents();
    this.start();
    this.awake();

    scene.entity.add(this.container);
  }

  public initComponents() {
    this.addComponent("avatar", new PlasmaEnemyAvatar(this));
    this.addComponent("body", new PlasmaEnemyBody(this));
    this.addComponent("movement", new PlasmaEnemyMovement(this));
  }
}

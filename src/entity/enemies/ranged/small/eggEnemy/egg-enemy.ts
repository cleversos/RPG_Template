import { MainScene } from "../../../../../scene/main-scene";
import { RangedEnemy } from "../../rangedEnemy";
import { EggEnemyAvatar } from "./components/avatar";
import { EggEnemyBody } from "./components/body";
import { EggEnemyMovement } from "./components/movement";

let eggEnemyLarge_nameID = 0;
let eggEnemySmall_nameID = 0;

export class EggEnemy extends RangedEnemy {
  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene,
    public isSmall: boolean
  ) {
    super(x, y, scene);
    this.life = 3;
    if(isSmall) {
      this.name = "EggEnemySmall_" + eggEnemySmall_nameID;
      eggEnemySmall_nameID += 1;
    } else {
      this.name = "EggEnemyLarge_" + eggEnemyLarge_nameID;
      eggEnemyLarge_nameID += 1;
    }

    this.initComponents();
    this.start();
    this.awake();

    scene.entity.add(this.container);
  }

  public initComponents() {
    this.addComponent("avatar", new EggEnemyAvatar(this));
    this.addComponent("body", new EggEnemyBody(this));
    this.addComponent("movement", new EggEnemyMovement(this));
  }
}

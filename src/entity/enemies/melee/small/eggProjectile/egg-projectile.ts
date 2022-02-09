import { MainScene } from "../../../../../scene/main-scene";
import { Enemy } from "../../../enemy";
import { MeleeEnemy } from "../../meleeEnemy";
import { EggProjectileAvatar } from "./components/avatar";
import { EggProjectileBody } from "./components/body";
import { EggProjectileMovement } from "./components/movement";

let nameID = 0;

export class EggProjectile extends MeleeEnemy {
  public constructor(
    public x: number,
    public y: number,
    public direction: number,
    public scene: MainScene
  ) {
    super(x, y, scene, direction);
    this.life = 3;
    this.name = "EggProjectile_" + nameID;
    nameID += 1;

    this.initComponents();
    this.start();
    this.awake();

    Enemy.ModifyEnemyCount(-1);

    scene.entity.add(this.container);
  }

  public destroy() {
    if (this.container) this.container.destroy();
    super.destroy();
  }

  public initComponents() {
    this.addComponent("avatar", new EggProjectileAvatar(this));
    this.addComponent("body", new EggProjectileBody(this));
    this.addComponent("movement", new EggProjectileMovement(this));
  }
}

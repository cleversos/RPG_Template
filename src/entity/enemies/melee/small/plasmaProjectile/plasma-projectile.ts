import { MainScene } from "../../../../../scene/main-scene";
import { Enemy } from "../../../enemy";
import { MeleeEnemy } from "../../meleeEnemy";
import { PlasmaProjectileAvatar } from "./components/avatar";
import { PlasmaProjectileBody } from "./components/body";
import { PlasmaProjectileMovement } from "./components/movement";

let nameID = 0;

export class PlasmaProjectile extends MeleeEnemy {
  public constructor(
    public x: number,
    public y: number,
    public direction: number,
    public scene: MainScene
  ) {
    super(x, y, scene, direction);
    this.life = 30;
    this.name = "PlasmaProjectile_" + nameID;
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
    this.addComponent("avatar", new PlasmaProjectileAvatar(this));
    this.addComponent("body", new PlasmaProjectileBody(this));
    this.addComponent("movement", new PlasmaProjectileMovement(this));
  }
}

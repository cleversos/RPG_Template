import { MainScene } from "../../../../../scene/main-scene";
import { Enemy } from "../../../enemy";
import { MeleeEnemy } from "../../meleeEnemy";
import { LavaProjectileAvatar } from "./components/avatar";
import { LavaProjectileBody } from "./components/body";
import { LavaProjectileMovement } from "./components/movement";

let nameID = 0;

export class LavaProjectile extends MeleeEnemy {
  public constructor(
    public x: number,
    public y: number,
    public direction: number,
    public scene: MainScene
  ) {
    super(x, y, scene, direction);
    this.life = 30;
    this.name = "LavaProjectile_" + nameID;
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
    this.addComponent("avatar", new LavaProjectileAvatar(this));
    this.addComponent("body", new LavaProjectileBody(this));
    this.addComponent("movement", new LavaProjectileMovement(this));
  }
}

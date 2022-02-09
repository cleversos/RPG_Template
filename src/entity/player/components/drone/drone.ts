import { MainScene } from "../../../../scene/main-scene";
import { Entity, EntityComponent } from "../../../entity";
import { Player } from "../../player";
import { DroneAvatar } from "./components/avatar";
import { DroneMovement } from "./components/movement";
import { DroneShoot } from "./components/shoot";

export class Drone extends Entity {
  public scene: MainScene;
  public container: Phaser.GameObjects.Container;
  public constructor(public parent: Player) {
    super();
    this.scene = parent.scene;
    this.container = this.scene.add.container(parent.x + 40, parent.y - 100);
    this.container.update = () => this.update();

    this._initComponents();
    this.awake();
    this.start();

    this.scene.entity.add(this.container);
  }

  private _initComponents() {
    this.addComponent("avatar", new DroneAvatar(this));
    this.addComponent("movement", new DroneMovement(this));
    this.addComponent("shoot", new DroneShoot(this));
  }

  public destroy() {
    if (this.container) {
      this.container.destroy();
      this.container = undefined;
    }
    super.destroy();
  }
}

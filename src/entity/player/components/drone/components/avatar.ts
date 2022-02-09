import { EntityComponent } from "../../../../entity";
import { Drone } from "../drone";

export class DroneAvatar extends EntityComponent {
  public image: Phaser.GameObjects.Image;

  public constructor(public parent: Drone) {
    super();
  }

  public start() {
    const { scene, container } = this.parent;
    this.image = scene.add.image(0, 0, "decor-drone");
    console.log(this.image);
    container.add(this.image);
    container.setDepth(150);
  }
}

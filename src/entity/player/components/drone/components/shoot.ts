import { Vec2 } from "planck-js";
import { PLAYER_VARS } from "../../../../../helpers/vars";
import { MainScene } from "../../../../../scene/main-scene";
import { EntityComponent } from "../../../../entity";
import { Drone } from "../drone";
import { Bullet } from "../entity/bullet/bullet";
import { DroneAvatar } from "./avatar";

export class DroneShoot extends EntityComponent {
  public scene: MainScene;
  public avatar: DroneAvatar;

  public shootDelay: number = 0;

  public laser: Phaser.GameObjects.Line;
  public constructor(public parent: Drone) {
    super();
    this.scene = parent.scene;
  }

  public start() {
    this.avatar = this.parent.getComponent<DroneAvatar>("avatar");
    this.laser = this.scene.add
      .line(0, 0, 1, 1, 22, 22, 0xff0000)
      .setAlpha(0)
      .setOrigin(0);
    this.scene.input.on("pointerdown", this.pointerDown.bind(this));
  }

  public destroy() {
    this.scene.input.off("pointerdown", this.pointerDown.bind(this));
  }

  public update() {
    if (this.shootDelay > 0) {
      this.shootDelay -= 1000 / 80;
    }
  }

  public pointerDown(pointer: Phaser.Input.Pointer) {
    if (this.shootDelay > 0) return;
    const origin = {
      x: this.avatar.image.x + this.parent.container.x,
      y: this.avatar.image.y + this.parent.container.y,
    };
    const directionVector = new Phaser.Math.Vector2(
      pointer.worldX - origin.x,
      pointer.worldY - origin.y
    );

    this.laser.setAlpha(0);
    this.laser.setTo(origin.x, origin.y, pointer.worldX, pointer.worldY);

    const speedVector = directionVector.normalize();

    new Bullet(origin.x, origin.y, speedVector.x, speedVector.y, this.scene);
    this.shootDelay = PLAYER_VARS.bullet.delay;
  }
}

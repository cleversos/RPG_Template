import { EntityComponent } from "../../../../entity";
import { Drone } from "../drone";
import { DroneAvatar } from "./avatar";

export class DroneMovement extends EntityComponent {
  public tween: Phaser.Tweens.Tween;
  public constructor(public parent: Drone) {
    super();
  }

  update() {
    const parent = this.parent;
    const scene = this.parent.scene;
    const player = parent.parent;

    const distanceX = Math.abs(player.x - parent.container.x);
    const distanceY = Math.abs(player.y - parent.container.y);

    if (!this.tween) {
      const avatar = parent.getComponent<DroneAvatar>("avatar");
      if (avatar && avatar.image) {
        this.tween = scene.tweens.add({
          targets: [avatar.image],
          y: -20,
          duration: 1000,
          ease: Phaser.Math.Easing.Linear,
          yoyo: true,
          repeat: -1,
        });
      }
    }
    if (distanceY > 100) {
      const direction = player.y > parent.container.y ? 1 : -1;
      const speed = 450;
      parent.container.y += direction * speed * (1 / 80);
    }

    if (distanceX > 40) {
      const direction = player.x > parent.container.x ? 1 : -1;
      const speed = 450;
      parent.container.x += direction * speed * (1 / 80);
    }
  }

  public createTween() {}
}

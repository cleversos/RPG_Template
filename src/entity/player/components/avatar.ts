import { AnimationObject } from "../../../animation/animation";
import { AnimationData } from "../../../animation/data";
import { PLAYER_TEXTURE_DEPTH } from "../../../helpers/vars";
import { EntityComponent } from "../../entity";
import { Player } from "../player";

export class PlayerAvatar extends EntityComponent {
  public avatar: AnimationObject;
  public attackSlash: AnimationObject;
  public constructor(public player: Player) {
    super();
  }

  start() {
    const scene = this.player.scene;
    const container = this.player.container;
    this.avatar = new AnimationObject(scene, "1", 0, 25);
    this.attackSlash = new AnimationObject(scene, "2", 0, 25);

    this.avatar.image.setTintFill

    const slashAnchor = AnimationData.get(scene, "1").actionsMetadata.get(6)
      .points[1];

    let [ox, oy] = [120 - slashAnchor.x, 100 - slashAnchor.y];
    this.attackSlash.ox = -(ox - 120);
    this.attackSlash.oy = oy;

    this.attackSlash.image.setScale(4, 1);

    this.avatar.framerate = this.attackSlash.framerate = 1000 / 90;
    this.avatar.action = 1;

    this.attackSlash.image.setTint(0xff0000);

    container.add(this.avatar.image);
    container.add(this.attackSlash.image);
    container.setDepth(PLAYER_TEXTURE_DEPTH);
    console.log("player avatar");
  }

  public update() {
    if (![6, 7, 8].find((a) => a === this.avatar.action)) {
      this.attackSlash.image.setAlpha(0);
    } else {
      this.attackSlash.image.setAlpha(1);
    }
  }
}

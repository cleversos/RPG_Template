import { AnimationObject } from "../animation/animation";
import { MainScene } from "./main-scene";

export class FPSTestScene extends MainScene {
  public async create() {
    await super.create();
    const playerRun = new AnimationObject(this, "1", 100, 200);
    const playerIdle = new AnimationObject(this, "1", 200, 200);
    const fallAnimation = new AnimationObject(this, "1", 300, 200);
    const attacking = new AnimationObject(this, "1", 400, 200);

    playerRun.framerate =
      fallAnimation.framerate =
      attacking.framerate =
      playerIdle.framerate =
        1000 / 90;

    playerRun.action = 1;
    playerIdle.action = 0;
    fallAnimation.action = 2;
    attacking.action = 6;
  }
}

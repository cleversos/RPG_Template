import Phaser from "phaser";
import { MainScene } from "../scene/main-scene";
import { AnimationData } from "./data";
import { AnimationLoader } from "./loader";

export class AnimationObject {
  public image: Phaser.GameObjects.Image;
  public imageOutline: Phaser.GameObjects.Image;
  public imageRenderOutline: Phaser.GameObjects.RenderTexture;
  public action: number = 0;
  public frame: number = 0;
  public delay: number = 0;
  public loop: boolean = true;
  public pause: boolean = false;
  public framerate: number = 1000 / 60;
  public reversed: boolean = false;

  public ox: number = 0;
  public oy: number = 0;

  public constructor(
    public scene: MainScene,
    public animation: string,
    public x: number,
    public y: number
  ) {
    this.image = scene.add.image(x, y, "cas");
    this.imageOutline = scene.add.image(x, y, "cas");
    this.imageRenderOutline = scene.add.renderTexture(x, y, 200, 200);
    this.imageOutline.setAlpha(0.01);
    this.image.setVisible(false);
    this.imageOutline.setVisible(false);

    this.imageRenderOutline.setVisible(false);

    scene.entity.add(this.image);
    const load = AnimationLoader.loadAnimation(scene, animation);
    if (load === true) {
      this.init();
    } else {
      load.once("complete", () => {
        this.init();
      });
    }
  }

  public init() {
    this.getFrame();
    this.image.setVisible(true);
    this.image.update = () => {
      this.playAction(this.action);
    };
  }

  public getFrame() {
    const data = AnimationData.get(this.scene, this.animation);
    if (!data) return;
    const texture = this.scene.textures.get(
      `animation-${this.animation}-${this.action}`
    );
    if (!data.actionsFrames.get(this.action)) return;
    const metadata = data.actionsMetadata.get(this.action);
    const frame = data.actionsFrames.get(this.action).get(this.frame);
    if (frame && metadata) {
      if (!texture.has(this.frame.toString()))
        texture.add(
          this.frame.toString(),
          0,
          frame.x,
          frame.y,
          metadata.width,
          metadata.height
        );
      this.image.setTexture(texture.key);

      this.image.setFrame(this.frame.toString());
      this.image.setDisplayOrigin(
        metadata.points[0].x + this.ox,
        metadata.points[0].y + this.oy
      );

      this.imageRenderOutline.setDepth(500);
      this.imageOutline.setTexture(texture.key);
      this.imageOutline.setFrame(this.frame.toString());
      this.imageOutline.setOrigin(0);
      // this.imageOutline.setDisplayOrigin(metadata.pivot.x, metadata.pivot.y);
      this.imageRenderOutline.clear();
      this.imageRenderOutline.draw(this.imageOutline, 0, 0);
      this.imageRenderOutline.setDisplayOrigin(
        metadata.points[0].x + this.ox,
        metadata.points[0].y + this.oy
      );
      const colorPipeline = (this.scene.renderer as any).pipelines.get(
        "ColorFX"
      );

      this.imageRenderOutline.setPipeline(colorPipeline);
    }
  }

  public playAction(action: number, replay: boolean = false) {
    const data = AnimationData.get(this.scene, this.animation);
    if (!data) return;
    if (this.pause) return;
    if (this.reversed) {
      if (this.action !== action) {
        this.action = action;
        this.frame = this.getAnimationSize();
        this.delay = this.framerate;
        this.getFrame();
      } else if (this.delay > 0) {
        this.delay -= 1000 / 80;
      } else {
        if (!data.actionsFrames.get(this.action)) return;
        const end = data.actionsFrames.get(this.action).size;
        if (this.frame > 0) {
          this.frame -= 1;
        } else if (this.loop) {
          this.frame = end;
        }
        this.delay = this.framerate;
        this.getFrame();
      }
    } else {
      if (this.action !== action) {
        this.frame = 0;
        this.action = action;
        this.delay = this.framerate;
        this.getFrame();
      } else if (this.delay > 0) {
        this.delay -= 1000 / 80;
      } else {
        if (!data.actionsFrames.get(this.action)) return;
        const end = data.actionsFrames.get(this.action).size;
        if (this.frame + 1 < end) {
          this.frame += 1;
        } else if (this.loop) {
          this.frame = 0;
        }
        this.delay = this.framerate;
        this.getFrame();
      }
    }
  }

  public getAnimationSize() {
    const animationData = AnimationData.get(this.scene, this.animation);
    if (!animationData) return;
    const frames = animationData.actionsFrames.get(this.action);
    if (!frames) return;
    const end = frames.size;
    return end;
  }
}

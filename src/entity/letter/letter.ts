import { MainScene } from "../../scene/main-scene";
import { Entity } from "../entity";
import { Hud } from "../hud/hud";
import { LetterBody } from "./components/body";

export class Letter extends Entity {
  public container: Phaser.GameObjects.Container;

  public constructor(
    public x: number,
    public y: number,
    public letter: string,
    public scene: MainScene,
    public hud: Hud
  ) {
    super();
    this.container = scene.add.container(x, y);

    this.container.update = () => {
      this.update();
    };

    const background = scene.add.circle(0, 0, 30, 0xffd600);
    const letterObject = scene.add
      .text(0, 0, letter, {
        fontFamily: "Roboto",
        fontSize: "45px",
        color: "#000",
      })
      .setOrigin(0.5);

    this.container.add(background);
    this.container.add(letterObject);

    this.addComponent("body", new LetterBody(this));

    this.awake();
    this.start();

    scene.entity.add(this.container);
  }

  destroy() {
    if (this.container) this.container.destroy();
    super.destroy();
  }
}

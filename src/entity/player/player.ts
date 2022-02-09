import { MainScene } from "../../scene/main-scene";
import { Entity } from "../entity";
import { PlayerAbilities } from "./components/abilities";
import { PlayerAvatar } from "./components/avatar";
import { PlayerBody } from "./components/body";
import { PlayerCollision } from "./components/collision";
import { Drone } from "./components/drone/drone";
import { PlayerMovement } from "./components/movement";

export let playerInWorld: Player;

export class Player extends Entity {
  public container: Phaser.GameObjects.Container;
  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene
  ) {
    super();
    this.container = scene.add.container(x, y);
    this.container.update = () => this.update();
    this._initComponents();
    this.start();
    this.awake();

    scene.cameras.main.setBounds(-2000, 0, 4000, 992);

    scene.cameras.main.startFollow(this.container);
    scene.entity.add(this.container);

    new Drone(this);

    playerInWorld = this;
  }

  private _initComponents() {
    this.addComponent("player-avatar", new PlayerAvatar(this));
    this.addComponent("player-body", new PlayerBody(this));
    this.addComponent("player-movement", new PlayerMovement(this));
    this.addComponent("player-abilities", new PlayerAbilities(this));
    this.addComponent("player-collision", new PlayerCollision(this));
  }

  public destroy() {
    if (this.container) this.container.destroy();
    super.destroy();
  }
}

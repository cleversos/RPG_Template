import { MainScene } from "../../../../../scene/main-scene";
import { MeleeEnemy } from "../../meleeEnemy";
import { NightEnemyAvatar } from "./components/avatar";
import { NightEnemyBody } from "./components/body";
import { NightEnemyMovement } from "./components/movement";

let nightEnemy_nameID = 0;

export class NightEnemy extends MeleeEnemy {
  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene,
  ) {
    super(x, y, scene);

    this.name = "NightEnemy_" + nightEnemy_nameID;
    this.life = 2;
    nightEnemy_nameID += 1;

    this.initComponents();
    this.start();
    this.awake();

    scene.entity.add(this.container);
  }

  public initComponents() {
    this.addComponent("avatar", new NightEnemyAvatar(this));
    this.addComponent("body", new NightEnemyBody(this));
    this.addComponent("movement", new NightEnemyMovement(this));
  }
}

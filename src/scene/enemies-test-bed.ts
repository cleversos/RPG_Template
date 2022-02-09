import { EggEnemy } from "../entity/enemies/ranged/small/eggEnemy/egg-enemy";
import { SickEnemy } from "../entity/enemies/melee/small/sickEnemy/sick-enemy";
import { Player } from "../entity/player/player";
import { MainScene } from "./main-scene";
import { GameCore } from "../core/game";
import { Vec2 } from "planck-js";
import { PlanckPhysics } from "../physic/planck";
import { PlanckPhaserAdapter } from "../physic/planck-phaser-adapter";
import { OceanEnemy } from "../entity/enemies/ranged/small/oceanEnemy/ocean-enemy";
import { BubbleEnemy } from "../entity/enemies/melee/small/bubbleEnemy/bubble-enemy";

//@ts-ignore
import * as pl from "planck-js/dist/planck-with-testbed";
import { CycleEnemy } from "../entity/enemies/melee/medium/cycleEnemy/cycle-enemy";
import { HeatEnemy } from "../entity/enemies/ranged/medium/heat/heat-enemy";
import { PlasmaEnemy } from "../entity/enemies/ranged/medium/plasma/plasma-enemy";

const adapter = PlanckPhaserAdapter;

export class EnemiesTestBedScene extends MainScene {
  public entity: Phaser.GameObjects.Group;

  constructor() {
    super("enemies-test-bed-scene");
  }

  public async preload() {}
  public async create() {
    await super.create();

    this.initPhysics();
    this.createGround();

    this.createEnemies();

    new Player(0, 600, this);

    // pl.testbed({}, (t: any) => {
    //   const adapter = PlanckPhaserAdapter;
    //   const worldScale = adapter.planckPhysics.worldScale;
    //   t.scaleY = 1;
    //   console.log(t.width, t.height, "=> ");
    //   t.width = worldScale * 1920;
    //   t.height = worldScale * 992;

    //   t.x = t.width / 2;
    //   t.y = t.height / 2;

    //   return adapter.world;
    // });
  }

  public update() {
    adapter.update();
  }

  private initPhysics() {
    const physics = new PlanckPhysics(0.03, Vec2(0, 250));
    adapter.init(physics, this);
    GameCore.init();
  }

  private createGround() {
    // visual ground
    // const ground = this.add.rectangle(-200, 800, 1920, 100, 0x23ff23).setOrigin(0).setDepth(100);

    // physics ground
    const groundBody = adapter.createRectangle(-2000, 992 - 40, 8000, 50);
    groundBody.setStatic();
    groundBody.setUserData({ tag: "ground" });

    // adapter.bodies.get(groundBody).setAlpha(0);
  }

  private createEnemies() {
    for (let i = 0; i < 10; i++) {
      new PlasmaEnemy(i * 110, 700, this);
    }

    // new PlasmaEnemy(250, 700, this);
  }
}

import { AnimationObject } from "../animation/animation";
import { GameCore } from "../core/game";
import { Background } from "../entity/background/background";
import { EggEnemy } from "../entity/enemies/ranged/small/eggEnemy/egg-enemy";
import { SickEnemy } from "../entity/enemies/melee/small/sickEnemy/sick-enemy";
import { Hole } from "../entity/hole/hole";
import { Hud } from "../entity/hud/hud";
import { LetterSystem } from "../entity/letter-system/letter-system";
import { Player } from "../entity/player/player";
import { PlanckPhaserAdapter } from "../physic/planck-phaser-adapter";
import { MainScene } from "./main-scene";

//@ts-ignore
import * as pl from "planck-js/dist/planck-with-testbed";
import { Enemy } from "../entity/enemies/enemy";

const adapter = PlanckPhaserAdapter;

export class GameScene extends MainScene {
  public hud: Hud;

  public holes: Hole[] = [];
  public holeSpawnDelay: number = 0;

  public minDelay: number = 5000;
  public maxDelay: number = 18000;
  public holesSpawnOver: boolean = false;
  public holesCount: number = 0;
  public gameSceneReady: boolean = false;

  public waveEndDelay: number = 0;
  constructor() {
    super("game-scene");
  }

  public async create() {
    GameCore.waveTimer = 1.5 * 60000;
    await super.create();
    this.waveEndDelay = 2000;
    Enemy.EnemyCount = 0;
    this.holesSpawnOver = false;

    this.holesCount = 1 + GameCore.waveCount * 2;
    this.holeSpawnDelay = this.getRandom(this.minDelay, this.maxDelay);

    this.gameSceneReady = true;

    this.add
      .image(0, 0, "decor-ciel")
      .setOrigin(0)
      .setDepth(-1000)
      .setScrollFactor(0);

    const ground = this.add.image(0, 992 - 90, "decor-sol").setOrigin(0);
    new Background(1920, 992 - 85, this);
    const hud = new Hud(30, 30, this);

    this.hud = hud;
    // new LetterSystem(this, hud);

    ground.setScrollFactor(0);

    const player = new Player(120, 120, this);

    const groundBody = adapter.createRectangle(-2000, 992 - 40, 8000, 50);
    const wallBody = adapter.createRectangle(2000, 992 / 2, 20, 2000);
    const wallBody2 = adapter.createRectangle(-2000, 992 / 2, 20, 2000);
    wallBody2.setStatic();
    wallBody.setStatic();
    groundBody.setStatic();
    groundBody.setUserData({ tag: "ground" });
    // new Hole(this.getRandom(-100, 2000), this.getRandom(350, 500), this);

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

    adapter.bodies.get(groundBody).setAlpha(0);

    // const pool = new AnimationObject(this, "5", 120, 120);
    // pool.action = 3;
  }

  public update() {
    super.update();
    //
    if (!this.gameSceneReady) return;
    if (this.holesCount > 0) {
      if (this.holeSpawnDelay > 0) {
        this.holeSpawnDelay -= 1000 / 80;
      } else {
        this.holes.push(
          new Hole(this.getRandom(0, 1200), this.getRandom(350, 500), this)
        );
        this.holeSpawnDelay = this.getRandom(this.minDelay, this.maxDelay);
        this.holesCount -= 1;
      }
    } else if (!this.holesSpawnOver) {
      let holeOver = true;
      this.holes.forEach((h) => {
        if (!holeOver) return;
        if (h.container) {
          holeOver = false;
        }
      });
      this.holesSpawnOver = holeOver;
    }

    if (this.holesSpawnOver) {
      if (Enemy.EnemyCount <= 0) {
        if (this.waveEndDelay > 0) {
          this.waveEndDelay -= 1000 / 80;
        } else {
          this.scene.start("wave-end-scene");
          GameCore.waveCount += 1;
        }
      }
    }
  }

  public getRandom(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min));
  }
}

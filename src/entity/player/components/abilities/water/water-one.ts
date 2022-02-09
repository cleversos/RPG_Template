import { MainScene } from "../../../../../scene/main-scene";
import { playerInWorld } from "../../../player";
import { PlayerAbilities } from "../../abilities";
import { ConsumableAbility } from "../ability";
import { Puddle } from "./entity/puddle/puddle";

export class WaterOne extends ConsumableAbility {
  public scene: MainScene;
  public poolRemaning: number;
  public rainDuration: number;

  public raining: boolean = false;
  public startingRain: boolean = false;
  public stoppingRain: boolean = false;

  public poolSpawnDelay: number = 0;

  public rainParticleManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  public rainParticleEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  public rainBlackFilter: Phaser.GameObjects.Rectangle;

  public constructor(public abilities: PlayerAbilities) {
    super();
    this.scene = abilities.parent.scene;
    this._init();
  }
  private _init() {
    const scene = this.scene;
    this.poolRemaning = this.getRandom(2, 4);
    this.rainDuration = this.getRandom(10000, 20000);
    this.rainParticleManager = scene.add
      .particles("particle-rain")
      .setDepth(20);
    this.rainBlackFilter = scene.add
      .rectangle(0, 0, 1920, 996, 0x000000, 0)
      .setDepth(21)
      .setOrigin(0, 0)
      .setScrollFactor(0);
  }

  private async _startRain() {
    const scene = this.scene;
    this.startingRain = true;
    await new Promise((res, rej) => {
      scene.tweens.add({
        targets: [this.rainBlackFilter],
        fillAlpha: 0.4,
        duration: 1200,
        onComplete: () => {
          this.poolSpawnDelay = this.getRandom(600, 2000);
          res(true);
        },
      });
    });
    if (!this.rainParticleEmitter) {
      this.rainParticleEmitter = this.rainParticleManager
        .createEmitter({
          x: { min: 0, max: 1920 },
          y: -100,
          lifespan: 4000,
          speedY: { min: 1300, max: 2000 },
          scale: { min: 0.1, max: 0.4, end: 0 },
          quantity: 8,
          blendMode: "ADD",
        })
        .setScrollFactor(0);
    } else {
      this.rainParticleEmitter.resume();
    }

    this.raining = true;
    this.startingRain = false;
  }

  private async _stopRain() {
    const scene = this.scene;
    this.stoppingRain = true;
    if (this.rainParticleEmitter) this.rainParticleEmitter.stop();
    await new Promise((res, rej) => {
      scene.tweens.add({
        targets: [this.rainBlackFilter],
        fillAlpha: 0,
        duration: 1200,
        onComplete: () => {
          res(true);
        },
      });
    });
    this.stoppingRain = false;
    this.raining = false;
  }

  public update() {
    if (!this.startingRain && !this.stoppingRain) {
      if (this.raining) {
        if (this.rainDuration > 0) {
          this.rainDuration -= 1000 / 80;
        } else {
          this._stopRain();
        }
      } else {
        if (this.rainDuration > 0) {
          this._startRain();
        }
      }
    }
    // 950

    if (this.raining && this.poolRemaning > 0) {
      if (this.poolSpawnDelay > 0) {
        this.poolSpawnDelay -= 1000 / 80;
      } else {
        this.poolSpawnDelay = this.getRandom(600, 2000);
        const direction = Math.random() > 0.5 ? -1 : 1;
        const offset = this.getRandom(200, 800);
        new Puddle(this, playerInWorld.container.x + direction * offset, 950);
        this.poolRemaning -= 1;
      }
    }
  }

  public stack() {
    if (this.raining || this.startingRain) {
      this.rainDuration += this.getRandom(3000, 7000);
      this.poolRemaning += 1;
    } else if (this.stoppingRain) {
      this.poolRemaning = this.getRandom(2, 4);
      this.rainDuration = this.getRandom(3000, 7000);
      this._startRain();
    }
  }

  public getRandom(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min));
  }
}

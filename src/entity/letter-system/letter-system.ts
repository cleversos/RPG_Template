import { GameCore } from "../../core/game";
import { MainScene } from "../../scene/main-scene";
import { EggEnemy } from "../enemies/ranged/small/eggEnemy/egg-enemy";
import { EntityComponent } from "../entity";
import { Hud } from "../hud/hud";
import { Letter } from "../letter/letter";

export class LetterSystem extends EntityComponent {
  public static enemySpawned = 0;
  public static enemyLeftToSpawn = 20;

  public container: Phaser.GameObjects.Container;
  public spawnMinDelay: number = 800;
  public spawnMaxDelay: number = 2000;

  public minX: number = -700;
  public maxX: number = 1900;

  public letterCount: number = 0;

  public letters: string[] = [];

  public delay: number = 0;
  public constructor(public scene: MainScene, public hud: Hud) {
    super();
    this.letters = [...GameCore.letters];
    this.container = scene.add.container();
    this.container.update = () => this.update();

    this.awake();
    this.start();

    LetterSystem.enemySpawned = GameCore.waveEnemies;
    LetterSystem.enemyLeftToSpawn = GameCore.waveEnemies;

    scene.entity.add(this.container);
  }

  public update() {
    if (this.delay > 0) {
      this.delay -= 1000 / 80;
    } else {
      this.delay =
        this.spawnMinDelay +
        Math.floor(Math.random() * (this.spawnMaxDelay - this.spawnMinDelay));
      let letter =
        this.letters[Math.floor(Math.random() * this.letters.length)];
      let letterX = this.minX + Math.floor(Math.random() * this.maxX);
      new Letter(letterX, 120, letter, this.scene, this.hud);
      this.letterCount += 1;

      if (
        this.letterCount >=
        (LetterSystem.enemyLeftToSpawn > 10
          ? 4
          : LetterSystem.enemyLeftToSpawn > 3
          ? 4
          : 2)
      ) {
        if (LetterSystem.enemyLeftToSpawn > 0) {
          this.letterCount = 0;
          let enemyX = this.minX + Math.floor(Math.random() * this.maxX);
          LetterSystem.enemyLeftToSpawn -= 1;
        } else {
          if (LetterSystem.enemySpawned === 0) {
            this.scene.scene.start("wave-end-scene");
            GameCore.waveCount += 1;
            GameCore.waveEnemies += 4;
          }
        }
      }
    }
  }
}

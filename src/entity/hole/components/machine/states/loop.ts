import { HoleMachine } from "../machine";
import { HoleState } from "./state";
import { defaultSkills } from "../../../../../core/game";
import { Letter } from "../../../../letter/letter";
import { playerInWorld } from "../../../../player/player";
import { EggEnemy } from "../../../../enemies/ranged/small/eggEnemy/egg-enemy";
import { SickEnemy } from "../../../../enemies/melee/small/sickEnemy/sick-enemy";
import { NightEnemy } from "../../../../enemies/melee/small/nightEnemy/night-enemy";
import { OceanEnemy } from "../../../../enemies/ranged/small/oceanEnemy/ocean-enemy";
import { HoleCloseState } from "./close";

export class HoleLoopState extends HoleState {
  public enemies: number;
  public word: string[];

  public letterDelay: number;
  public enemyDelay: number;

  public minDelay: number = 10000;
  public maxDelay = 13000;

  public constructor(public machine: HoleMachine) {
    super(machine);
    const holeCloseTransition = (machine: HoleMachine) => {
      if (this.word.length === 0 && this.enemies <= 0) {
        this.machine.setState(new HoleCloseState(machine));
        return true;
      }
    };

    this.transitions.set("holeClose", holeCloseTransition);
  }

  public enter() {
    const animation = this.machine.animation.animationObject;
    animation.action = 1;
    animation.frame = 0;
    animation.loop = true;

    this.word =
      defaultSkills[Math.floor(Math.random() * defaultSkills.length)][0].split(
        ""
      );
    this.enemies = 2 + Math.floor(Math.random() * 8);

    this.letterDelay = 0;
    this.enemyDelay = this.getRandomDelay();
  }

  public update() {
    this.spawnLetters();
    this.spawnEnemies();
    super.update();
  }

  public spawnEnemies() {
    if (this.enemies > 0) {
      if (this.enemyDelay <= 0) {
        const scene = this.machine.parent.scene;
        const hud = scene.hud;

        let offsetDirection = Math.random() > 0.5 ? -1 : 1;
        let offsetX = Math.floor(Math.random() * 200) * offsetDirection;

        let nRand = Math.random();
        if (nRand > 0.8) {
          new EggEnemy(
            this.machine.parent.container.x + offsetX,
            this.machine.parent.container.y - 300,
            scene,
            false
          );
        } else if (nRand > 0.6) {
          new SickEnemy(
            this.machine.parent.container.x + offsetX,
            this.machine.parent.container.y - 300,
            scene
          );
        } else if (nRand > 0.4){
          new NightEnemy(
            this.machine.parent.container.x + offsetX,
            this.machine.parent.container.y - 300,
            scene
          );
        } else {
        new OceanEnemy(
          this.machine.parent.container.x + offsetX,
          this.machine.parent.container.y - 300,
          scene
        );
        }

        this.enemyDelay = this.getRandomDelay();
        this.enemies -= 1;
      } else {
        this.enemyDelay -= 1000 / 80;
      }




      if (this.enemies > 0) {
        if (this.enemyDelay <= 0) {
          const scene = this.machine.parent.scene;
          const hud = scene.hud;
  
          let offsetDirection = Math.random() > 0.5 ? -1 : 1;
          let offsetX = Math.floor(Math.random() * 100) * offsetDirection;
  
          let nRand = Math.random();
          if (nRand > 0.8) {
            new EggEnemy(
              this.machine.parent.container.x + offsetX,
              this.machine.parent.container.y - 300,
              scene,
              false
            );
          } else if (nRand > 0.6) {
            new SickEnemy(
              this.machine.parent.container.x + offsetX,
              this.machine.parent.container.y - 300,
              scene
            );
          } else if (nRand > 0.4){
            new NightEnemy(
              this.machine.parent.container.x + offsetX,
              this.machine.parent.container.y - 300,
              scene
            );
          } else {
          new OceanEnemy(
            this.machine.parent.container.x + offsetX,
            this.machine.parent.container.y - 300,
            scene
          );
          }
  
          this.enemyDelay = this.getRandomDelay();
          this.enemies -= 1;
        } else {
          this.enemyDelay -= 1000 / 80;
        }
      }  


      

    }
  }

  public spawnLetters() {
    if (this.word.length > 0) {
      if (this.letterDelay <= 0) {
        const scene = this.machine.parent.scene;
        const hud = scene.hud;

        let offsetDirection = Math.random() > 0.5 ? -1 : 1;
        let offsetX = Math.floor(Math.random() * 400) * offsetDirection;
        let letterIndex = Math.floor(Math.random() * this.word.length);
        let letter = this.word[letterIndex];
        new Letter(
          this.machine.parent.container.x + offsetX,
          this.machine.parent.container.y - 300,
          letter,
          scene,
          hud
        );

        this.word = this.word.filter((v, i) => i !== letterIndex);
        this.letterDelay = this.getRandomDelay();
      } else {
        this.letterDelay -= 500;
      }
    }
  }

  public getRandomDelay(): number {
    return (
      this.minDelay +
      Math.floor(Math.random() * (this.maxDelay - this.minDelay))
    );
  }
}

import { Vec2 } from "planck-js";
import { AnimationObject } from "../animation/animation";
import { AnimationLoader } from "../animation/loader";
import { GameCore } from "../core/game";
import { Background } from "../entity/background/background";
import { Tree } from "../entity/tree/tree";
import { UpgradeCard } from "../entity/upgrade-card/upgrade-card";
import { PlanckPhysics } from "../physic/planck";
import { PlanckPhaserAdapter } from "../physic/planck-phaser-adapter";
import {
  icons,
  decors,
  parts,
  buttons,
  enemies,
  particles
} from "./preload-assets";

//@ts-ignore
import * as pl from "planck-js/dist/planck-with-testbed";
export const adapter = PlanckPhaserAdapter;

export class MainScene extends Phaser.Scene {
  public entity: Phaser.GameObjects.Group;

  constructor(public key: string = "main-scene") {
    super(key);
  }

  public async preload() {
    this.load.svg("upgrade-card", "assets/ui/upgrade-card.svg");

    icons.forEach((icon) => {
      this.load.image(`icon-${icon}`, `assets/ui/icons/${icon}.png`);
    });

    decors.forEach((decor) => {
      this.load.image(`decor-${decor}`, `assets/decor/${decor}.png`);
    });

    parts.forEach((part) => {
      this.load.image(`part-${part}`, `assets/decor/parts/${part}.png`);
    });

    buttons.forEach((button) => {
      this.load.image(`button-${button}`, `assets/ui/buttons/${button}.png`);
    });

    enemies.forEach((enemy) => {
      this.load.atlas(
        enemy.textureName,
        enemy.textureImageURL,
        enemy.textureJSONURL
      );
    });

    particles.forEach((particle) => {
      this.load.image(
        `particle-${particle}`,
        `assets/particles/${particle}.png`
      );
    });
  }
  public async create() {
    this.entity = this.add.group();
    this.entity.runChildUpdate = true;

    const physics = new PlanckPhysics(0.03, Vec2(0, 250));
    adapter.init(physics, this);
    GameCore.init();

    await Promise.all(
      ["1", "2", "3", "4", "5", "6", "7"].map((a) => {
        return new Promise((res) => {
          const animation = AnimationLoader.loadAnimation(this, a);
          if (animation === true) res(true);
          else
            animation.once("complete", () => {
              console.log("load-complete");
              res(true);
            });
        });
      })
    );
  }

  public update() {
    adapter.update();
  }
}

import { GameCore } from "../../../core/game";
import { EntityComponent } from "../../entity";
import { Player } from "../player";
import { Ability, ConsumableAbility } from "./abilities/ability";
import { FireAbility } from "./abilities/fire/fire";
import { FireOne } from "./abilities/fire/fire-one";
import { FireThree } from "./abilities/fire/fire-three";
import { FireTwo } from "./abilities/fire/fire-two";
import { LightingOne } from "./abilities/lighting/lighting-one";
import { LightingThree } from "./abilities/lighting/lighting-three";
import { LightingTwo } from "./abilities/lighting/lighting-two";
import { WaterOne } from "./abilities/water/water-one";
import { WaterThree } from "./abilities/water/water-three";
import { WaterTwo } from "./abilities/water/water-two";
import { PlayerAvatar } from "./avatar";
import { PlayerBody } from "./body";
import { PlayerCollision } from "./collision";

export class PlayerAbilities extends EntityComponent {
  public abilities: Map<string, Ability> = new Map();
  public activeAbility: Ability;
  public playerCollision: PlayerCollision;

  public currentElement: string = "water";

  public abilityKeys: {
    j: Phaser.Input.Keyboard.Key;
    k: Phaser.Input.Keyboard.Key;
    l: Phaser.Input.Keyboard.Key;
    e: Phaser.Input.Keyboard.Key;
  };

  public abilityKeysReleases = {
    j: true,
    k: true,
    l: true,
    e: true,
  };

  public currentElementText: Phaser.GameObjects.Text;

  public attackSensor: string = "base-attack";

  public constructor(public parent: Player) {
    super();
  }

  public awake() {}

  public start() {
    const scene = this.parent.scene;
    this.playerCollision =
      this.parent.getComponent<PlayerCollision>("player-collision");

    this.abilityKeys = {
      j: scene.input.keyboard.addKey("J"),
      k: scene.input.keyboard.addKey("K"),
      l: scene.input.keyboard.addKey("L"),
      e: scene.input.keyboard.addKey("E"),
    };

    this.currentElementText = scene.add
      .text(1920 / 2, 120, "Element : WATER", {
        fontFamily: "Roboto",
        fontStyle: "bold",
        fontSize: "40px",
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(200);
  }

  public handleAbilityInputs() {
    // [key, abilityTag, energyCost, constructor, forceStack(even if consumable), maxStackLimit]
    const skills: [string, string, number, any, string, boolean?, number?][] = [
      ["j", "fire-two", 50, FireTwo, "magma"],
      ["k", "fire-one", 50, FireOne, "fire", true, 10],
      ["l", "fire-three", 50, FireThree, "blaze"],
      ["j", "water-three", 50, WaterThree, "wave"],
      ["k", "water-two", 50, WaterTwo, "bubble"],
      ["l", "water-one", 50, WaterOne, "cloud"],
      ["j", "lighting-one", 30, LightingOne, "lighting"],
      ["k", "lighting-two", 50, LightingTwo, "thunder"],
      ["l", "lighting-three", 50, LightingThree, "hurricane"],
    ];

    const notGroundedAbility = new Set<string>();
    notGroundedAbility.add("lighting-three");

    const action =
      this.parent.getComponent<PlayerAvatar>("player-avatar").avatar.action;

    const grounded = action === 0 || action === 1;

    const eKey = this.abilityKeys.e;
    const eRelease = this.abilityKeysReleases.e;

    if (eRelease && eKey.isDown) {
      this.abilityKeysReleases.e = false;
      if (this.currentElement === "water") this.currentElement = "fire";
      else if (this.currentElement === "fire") this.currentElement = "lighting";
      else this.currentElement = "water";
    }

    const skillsData = Array.from(GameCore.skills.values());
    const spelledWord = new Map<string, number>();

    for (let i = 0; i < skillsData.length; i += 1) {
      const skillData = skillsData[i];
      spelledWord.set(skillData.name, skillData.count);
    }
    for (let i = 0; i < skills.length; i += 1) {
      const [key, tag, cost, constructor, englishTag, forceStack, amount] =
        skills[i];
      const [element] = tag.split("-");
      let keyInput = (this.abilityKeys as any)[
        key
      ] as Phaser.Input.Keyboard.Key;
      let keyRelease = (this.abilityKeysReleases as any)[key];

      const a = spelledWord.get(englishTag);
      if (!a) continue;

      if (!grounded && !notGroundedAbility.has(tag)) if (!keyInput) continue;
      if (!keyRelease) continue;
      if (!keyInput.isDown) continue;

      if (cost > GameCore.stamina) continue;
      console.log(element, this.currentElement);
      if (element === this.currentElement) {
        console.log(element);
        let ability = this.abilities.get(tag);
        if (ability) {
          if (ability instanceof ConsumableAbility) {
            if (ability.abilityAmmo <= 0) {
              if (ability.stack) {
                GameCore.stamina -= cost;
                ability.stack();
                (this.abilityKeysReleases as any)[key] = false;
              }
            }
          } else {
            GameCore.stamina -= cost;
            ability.stack();
            (this.abilityKeysReleases as any)[key] = false;
          }

          if (forceStack) {
            if (constructor !== FireOne) {
              if ((ability as ConsumableAbility).abilityAmmo < amount) {
                if (ability.stack) {
                  GameCore.stamina -= cost;
                  ability.stack();
                  (this.abilityKeysReleases as any)[key] = false;
                }
              }
            } else {
              const fireOne = ability as FireOne;
              if (fireOne.circlesCount < amount) {
                if (ability.stack) {
                  GameCore.stamina -= cost;
                  ability.stack();
                  (this.abilityKeysReleases as any)[key] = false;
                }
              }
            }
          }
        } else {
          ability = new constructor(this) as Ability;
          this.abilities.set(tag, ability);
          GameCore.stamina -= cost;
          (this.abilityKeysReleases as any)[key] = false;
        }
      }
    }
  }

  public update() {
    if (!this.abilityKeysReleases.j && this.abilityKeys.j.isUp)
      this.abilityKeysReleases.j = true;

    if (!this.abilityKeysReleases.k && this.abilityKeys.k.isUp)
      this.abilityKeysReleases.k = true;

    if (!this.abilityKeysReleases.l && this.abilityKeys.l.isUp)
      this.abilityKeysReleases.l = true;

    if (!this.abilityKeysReleases.e && this.abilityKeys.e.isUp)
      this.abilityKeysReleases.e = true;

    this.abilities.forEach((a) => a.update());

    this.handleAbilityInputs();

    this.currentElementText.setText(
      "Element : " + this.currentElement.toUpperCase()
    );
  }

  public destroy() {
    this.abilities.forEach((a) => {
      a.destroy();
    });
  }

  public addAbility(tag: string) {
    if (!this.abilities.has(tag)) {
      let ability: Ability | undefined = undefined;
      switch (tag) {
        case "fire":
          ability = new FireOne(this);
          break;
        case "magma":
          ability = new FireTwo(this);
          break;
        case "blaze":
          ability = new FireThree(this);
          break;
        case "cloud":
          ability = new WaterOne(this);
          break;
        case "bubble":
          ability = new WaterTwo(this);
          break;
        case "wave":
          ability = new WaterThree(this);
          break;
        default:
          break;
      }
      if (ability) {
        this.abilities.set(tag, ability);
      }
    } else {
      const ability = this.abilities.get(tag);
      if (ability && ability.stack) ability.stack();
    }
  }
}

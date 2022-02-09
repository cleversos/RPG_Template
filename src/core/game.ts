import { Upgrade } from "./upgrade";
import { Skill } from "./skill";

const createUpgradeObject = (
  id: number,
  unlocked: boolean,
  cost: number
): Upgrade => {
  return {
    id,
    points: 0,
    unlocked,
    cost,
  };
};

const createSkillObject = (
  id: number,
  count: number,
  color: number,
  name: string
): Skill => {
  return {
    id,
    count,
    color,
    name,
  };
};

const defaultUpgrades: [string, boolean, number][] = [
  ["health", true, 230],
  ["energy", true, 270],
  ["attack", true, 342],
  ["defense", true, 830],
  ["dash", false, 263],
  ["blink", false, 476],
  ["hook", false, 379],
  ["drone", false, 483],
];

// -> [id, color, count]
export const defaultSkills: [string, number, number, string][] = [
  ["ሓዊ", 0x37c782, 0, "fire"], // -> Fire
  ["ሃልሃልታ", 0x8737c7, 0, "magma"], // -> Magma
  ["እሳት", 0xe738eb, 0, "blaze"], // -> Blaze
  ["ደበና", 0x0066ff, 0, "cloud"], // -> Cloud
  ["ነጐዳ", 0x00b4dc, 0, "bubble"], // -> Thunder
  ["ነጐዳበ", 0x00cd32, 0, "wave"], // -> WWave
  ["ህቦብላ", 0x00bdad, 0, "lighting"],
  ["ዝናም", 0xcdabdd, 0, "thunder"],
  ["ውሑጅ", 0xfefacd, 0, "hurricane"],
];

export class GameCore {
  public static letters: string[] = [];
  public static waveCount: number;
  public static waveTimer: number;
  public static heart: number;
  public static stamina: number;
  public static points: number;
  public static waves: number;
  public static upgrades: Map<string, Upgrade> = new Map();
  public static skills: Map<string, Skill> = new Map();
  public static waveEnemies: number;

  public static remainPoison: number = 0;
  public static poisonTime: number = 0;

  public static initialized: boolean = false;

  public static init() {
    const saves = window.localStorage.getItem("dawitt-defender-saves");
    if (GameCore.initialized) return;
    if (saves) {
      GameCore.useSaves(saves);
    } else {
      GameCore.setDefaultStats();
    }

    GameCore.initialized = true;
  }

  public static reset() {
    GameCore.setDefaultStats();
  }

  public static setDefaultStats() {
    GameCore.heart = 10;
    GameCore.stamina = 100;
    GameCore.points = 0;
    GameCore.waves = 0;
    GameCore.waveCount = 1;
    GameCore.waveEnemies = 6;
    GameCore.upgrades = new Map();

    defaultUpgrades.forEach(([name, unlocked, cost], id) => {
      GameCore.upgrades.set(name, createUpgradeObject(id, unlocked, cost));
    });

    defaultSkills.forEach(([name, color, count, englishName], id) => {
      GameCore.skills.set(
        name,
        createSkillObject(id, count, color, englishName)
      );
    });
  }

  public static useSaves(json: string) {}
}

defaultSkills.forEach((skill) => {
  let letters = skill[0].split("");
  GameCore.letters = GameCore.letters.concat(letters);
});
// GameCore.letters = "ሓዊሃል".split("");

import { GameCore } from "../../../core/game";
import { Skill } from "../../../core/skill";
import { MainScene } from "../../../scene/main-scene";
import { EntityComponent } from "../../entity";
import { PlayerAbilities } from "../../player/components/abilities";
import { playerInWorld } from "../../player/player";
import { Hud } from "../hud";

type SkillGameObject = {
  container: Phaser.GameObjects.Container;
  rect: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
};

type CursorControlKeys = {
  move: Phaser.Input.Keyboard.Key;
  use: Phaser.Input.Keyboard.Key;
};

export class SkillsComponents extends EntityComponent {
  public scene: MainScene;
  public container: Phaser.GameObjects.Container;
  public skillsContainer: Phaser.GameObjects.Container;
  public skillsRect: Map<Skill, SkillGameObject> = new Map();
  public skillCursor: Phaser.GameObjects.Rectangle;
  public cursorControlKeys: CursorControlKeys;

  public cursor: number = 0;
  public cursorSkill: Skill;

  public constructor(public parent: Hud) {
    super();
    this.scene = parent.scene;
    this.container = parent.container;
    this.skillsContainer = parent.scene.add.container(0, 90);
  }

  public start() {
    const scene = this.scene;
    this.cursorControlKeys = {
      move: scene.input.keyboard.addKey("E"),
      use: scene.input.keyboard.addKey("R"),
    };

    const { move, use } = this.cursorControlKeys;
    // move.onDown = () => {
    //   this.cursor += 1;
    // };

    // let useKeyReleased = true;
    // use.onDown = () => {
    //   if (!useKeyReleased) return;
    //   if (!this.cursorSkill) return;
    //   this.cursorSkill.count -= 1;
    //   const playerAbilities =
    //     playerInWorld.getComponent<PlayerAbilities>("player-abilities");
    //   if (playerAbilities) {
    //     playerAbilities.addAbility(this.cursorSkill.name);
    //   }
    //   useKeyReleased = false;
    // };

    // use.onUp = () => {
    //   useKeyReleased = true;
    // };
    this.initSkillBoxes();
  }

  public update() {
    let count = 0;
    let mapCursorId: Map<number, Skill> = new Map();
    GameCore.skills.forEach((s, name) => {
      if (s.count > 0) {
        let skill = this.skillsRect.get(s);
        if (!skill) {
          let skillContainer = this.scene.add.container((32 + 9) * count, 0);
          let skillCountsLabel = this.scene.add
            .text(16, 16, s.count.toString(), {
              fontFamily: "Roboto",
            })
            .setOrigin(0.5);
          let skillRect = this.scene.add
            .rectangle((32 + 9) * count, 0, 32, 32, s.color)
            .setOrigin(0);
          skillContainer.add(skillRect);
          skillContainer.add(skillCountsLabel);
          this.skillsContainer.add(skillContainer);
          skill = {
            container: skillContainer,
            rect: skillRect,
            label: skillCountsLabel,
          };
          this.skillsRect.set(s, skill);
        } else {
          skill.container.setAlpha(1);
        }
        skill.container.x = (32 + 9) * count;
        skill.label.setText(s.count.toString());
        mapCursorId.set(count, s);
        count += 1;
      } else {
        let skill = this.skillsRect.get(s);
        if (skill) {
          skill.container.setAlpha(0);
        }
      }
    });
    if (count === 0) {
      this.skillCursor.setAlpha(0);
      this.cursorSkill = undefined;
    } else {
      if (this.cursor + 1 > count) {
        this.cursor = 0;
      }
      this.skillCursor.setAlpha(1);
      this.skillCursor.x = (32 + 9) * this.cursor - 4;
      this.cursorSkill = mapCursorId.get(this.cursor);
    }
  }

  public initSkillBoxes() {
    const scene = this.scene;
    const container = this.container;
    const skillsContainer = this.skillsContainer;

    let skills = 4;
    let width = 32;
    let height = 32;

    const skillCursor = scene.add
      .rectangle((32 + 9) * this.cursor - 4, -3, 40, 39, 0xffffff)
      .setOrigin(0);

    this.skillCursor = skillCursor;

    skillsContainer.add(skillCursor);

    let count = 0;

    GameCore.skills.forEach((s, name) => {
      if (s.count > 0) {
        const skillContainer = scene.add.container((32 + 9) * count, 0);
        const skillCountsLabel = scene.add
          .text(16, 16, s.count.toString(), {
            fontFamily: "Roboto",
          })
          .setOrigin(0.5);
        const skill = scene.add.rectangle(0, 0, 32, 32, s.color).setOrigin(0);

        skillContainer.add(skill);
        skillContainer.add(skillCountsLabel);

        skillsContainer.add(skillContainer);
        this.skillsRect.set(s, {
          container: skillContainer,
          rect: skill,
          label: skillCountsLabel,
        });
        count += 1;
      }
    });

    if (count === 0) {
      skillCursor.setAlpha(0);
    }

    container.add(skillsContainer);
  }
}

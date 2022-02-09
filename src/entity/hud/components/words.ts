import { defaultSkills, GameCore } from "../../../core/game";
import { MainScene } from "../../../scene/main-scene";
import { EntityComponent } from "../../entity";
import { Hud } from "../hud";
import { SkillsComponents } from "./skills";

export class WordsComponent extends EntityComponent {
  public scene: MainScene;
  public container: Phaser.GameObjects.Container;
  public skillsComponent: SkillsComponents;
  public wordContainer: Phaser.GameObjects.Container;
  public wordTextGameObject: Phaser.GameObjects.Text;

  public discardLetterKey: Phaser.Input.Keyboard.Key;

  public letters: string[] = [];

  public constructor(public parent: Hud) {
    super();
    this.scene = parent.scene;
    this.container = parent.container;
    this.wordContainer = parent.scene.add.container();
    this.discardLetterKey = parent.scene.input.keyboard.addKey("T");
  }

  public awake() {
    this.wordContainer.setPosition(0, 90);
    this.wordTextGameObject = this.scene.add.text(
      0,
      0,
      this.letters.join(" "),
      {
        fontFamily: "Roboto",
        fontSize: "25px",
      }
    );
    this.wordContainer.add(this.wordTextGameObject);
    this.container.add(this.wordContainer);
  }

  public start() {
    this.skillsComponent = this.parent.getComponent<SkillsComponents>("skills");
    let discardKeyReleased = true;
    this.discardLetterKey.onDown = () => {
      if (!discardKeyReleased) return;
      this.letters.pop();
      discardKeyReleased = false;
    };

    this.discardLetterKey.onUp = () => {
      discardKeyReleased = true;
    };
  }

  public update() {
    if (this.skillsComponent.skillCursor.alpha === 0) {
      this.wordContainer.setPosition(0, 90);
    } else {
      this.wordContainer.setPosition(0, 135);
    }

    this.wordTextGameObject.setText(this.letters.join(" "));
  }

  public addLetter(letter: string) {
    this.letters.push(letter);
    let word = this.letters.join("");

    let skill = GameCore.skills.get(word);
    if (skill) {
      this.letters = [];
      skill.count += 1;
      GameCore.points += 5;
    }
  }
}

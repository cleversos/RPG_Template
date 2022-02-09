import { <FTName | pascalcase>EnemyAvatar } from "./components/avatar";
import { <FTName | pascalcase>EnemyBody } from "./components/body";
import { <FTName | pascalcase>EnemyMovement } from "./components/movement";

let <FTName | camelCase>_nameID = 0;

export class <FTName | pascalcase>Enemy extends <classExtended> {
  public constructor(
    public x: number,
    public y: number,
    public scene: MainScene,
  ) {
    super(x, y, scene);
    this.life = 30;
    this.name = "<FTName | pascalcase>Enemy_" + <FTName | camelCase>_nameID;
    <FTName | camelCase>_nameID += 1;

    // console.log('%cCreated enemy: ' + '%c' + this.name, logColors.create, enemies.<FTName | camelCase>.logColor);

    this.initComponents();
    this.start();
    this.awake();

    scene.entity.add(this.container);
  }

  public initComponents() {
    this.addComponent("avatar", new <FTName | pascalcase>EnemyAvatar(this));
    this.addComponent("body", new <FTName | pascalcase>EnemyBody(this));
    this.addComponent("movement", new <FTName | pascalcase>EnemyMovement(this));
  }
}

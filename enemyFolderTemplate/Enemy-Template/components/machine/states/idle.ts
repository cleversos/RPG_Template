import { Vec2 } from "planck-js";
import { <FTName | pascalcase>EnemyAvatar, <FTName | camelcase>_animationNames } from "../../avatar";
import { <FTName | pascalcase>EnemyBody } from "../../body";
import { <FTName | pascalcase>EnemyMachine } from "../machine";
import { <FTName | pascalcase>EnemyState } from "./state";

export class IdleState extends <FTName | pascalcase>EnemyState {
  public constructor(public machine: <FTName | pascalcase>EnemyMachine) {
    super(machine);

    /*
    const exampleTransition = (machine: <FTName | pascalcase> EnemyMachine) => {
      if (true) {
        this.machine.state = new ExampleState(machine); // ExampleState would need to imported and have its own file
        this.machine.state.enter();
        return true;
      }
    };

    this.transitions.set("example", exampleTransition);
    */
  }
  enter() {
    // if (enemies.oceanEnemy.isLogStateChanges) console.log('%cEnemy ' + this.machine.enemy.name + ' %centered state: ' + 'IdleState', enemies.oceanEnemy.logColor, logColors.state);

    const avatar: <FTName | pascalcase>EnemyAvatar = this.machine.enemy.getComponent("avatar");
    avatar.playAnimation(<FTName | camelcase>_animationNames.IDLE);
  }
  update() {
    super.update();
  }
}

import { Vec2 } from "planck-js";
import { playerInWorld } from "../../../../../../../player/player";
import { PlasmaEnemyAvatar, plasma_animationNames } from "../../avatar";
import { PlasmaEnemyBody } from "../../body";
import { PlasmaEnemyMachine } from "../machine";
import { ChasingState } from "./chasing";
import { DeadState } from "./dead";
import { PlasmaEnemyState } from "./state";

export class IdleState extends PlasmaEnemyState {
  public constructor(public machine: PlasmaEnemyMachine) {
    super(machine);

    const chaseTransition = (machine: PlasmaEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;
      const body = this.machine.enemy.getComponent<PlasmaEnemyBody>("body");

      if (body.groundSensorsContact.size === 0) return;

      if (
        avatar &&
        movement &&
        playerInWorld &&
        !this.machine.movement.knockBack &&
        this.machine.enemy.life > 0
      ) {
        this.machine.state = new ChasingState(machine);
        this.machine.state.enter();
        return true;
      }
    };

    const deadTransition = (machine: PlasmaEnemyMachine) => {
      if (this.machine.enemy.life <= 0) {
        machine.state = new DeadState(machine);
        machine.state.enter();
        return true;
      }
    };

    this.transitions.set("dead", deadTransition);
    this.transitions.set("chase", chaseTransition);
  }
  enter() {
    // if (enemies.oceanEnemy.isLogStateChanges) console.log('%cEnemy ' + this.machine.enemy.name + ' %centered state: ' + 'IdleState', enemies.oceanEnemy.logColor, logColors.state);

    const avatar: PlasmaEnemyAvatar = this.machine.enemy.getComponent("avatar");
    avatar.playAnimation(plasma_animationNames.IDLE);
    avatar.setStateText("IDLE", "#00ff00");
  }
  update() {
    super.update();
  }
}

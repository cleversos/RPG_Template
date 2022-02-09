import { Vec2 } from "planck-js";
import { playerInWorld } from "../../../../../../../player/player";
import { HeatEnemyAvatar, heat_animationNames } from "../../avatar";
import { HeatEnemyBody } from "../../body";
import { HeatEnemyMachine } from "../machine";
import { ChasingState } from "./chasing";
import { DeadState } from "./dead";
import { HeatEnemyState } from "./state";

export class IdleState extends HeatEnemyState {
  public constructor(public machine: HeatEnemyMachine) {
    super(machine);

    const chaseTransition = (machine: HeatEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;
      const body = this.machine.enemy.getComponent<HeatEnemyBody>("body");

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

    const deadTransition = (machine: HeatEnemyMachine) => {
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

    const avatar: HeatEnemyAvatar = this.machine.enemy.getComponent("avatar");
    avatar.playAnimation(heat_animationNames.IDLE);
    avatar.setStateText("IDLE", "#00ff00");
  }
  update() {
    super.update();
  }
}

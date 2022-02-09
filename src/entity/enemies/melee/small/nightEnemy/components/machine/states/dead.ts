import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { GameCore } from "../../../../../../../../core/game";
import { LetterSystem } from "../../../../../../../letter-system/letter-system";
import { playerInWorld } from "../../../../../../../player/player";
import { NightEnemyBody } from "../../body";
import { NightEnemyMachine } from "../machine";
import { NightEnemyAvatar } from "../../avatar";
import { ExplodeState } from "./explode";
import { NightEnemyState } from "./state";
import { PlayerBody } from "../../../../../../../player/components/body";

export class DeadState extends NightEnemyState {
  public timePassed: boolean = false;

  public constructor(public machine: NightEnemyMachine) {
    super(machine);
    const explodeTransition = (machine: NightEnemyMachine) => {
      if(this.timePassed) {
        this.machine.state = new ExplodeState(machine);
        this.machine.state.enter();
        return true;
      }
    };

    this.transitions.set("explode", explodeTransition);
  }
  
  enter() {
      const nightEnemyAvatar =
          this.machine.enemy.getComponent<NightEnemyAvatar>("avatar");
      nightEnemyAvatar.avatar.play("night-dead");
      
      const nExplosionTime = enemies.nightEnemy.minExplosionTime + Math.floor(Math.random()*(enemies.nightEnemy.maxExplosionTime-enemies.nightEnemy.minExplosionTime))
      setTimeout(() => {
        this.timePassed = true;
      }, nExplosionTime * 1000);
  }

  update() {
    super.update();
  }
}

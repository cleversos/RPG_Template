import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { GameCore } from "../../../../../../../../core/game";
import { LetterSystem } from "../../../../../../../letter-system/letter-system";
import { playerInWorld } from "../../../../../../../player/player";
import { NightEnemyBody } from "../../body";
import { NightEnemyMachine } from "../machine";
import { NightEnemyAvatar } from "../../avatar";
import { ChasingState } from "./chasing";
import { DeadState } from "./dead";
import { NightEnemyState } from "./state";
import { PlayerBody } from "../../../../../../../player/components/body";

export class IdleState extends NightEnemyState {
  public constructor(public machine: NightEnemyMachine) {
    super(machine);

    const chaseTransition = (machine: NightEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;
      const body =
        this.machine.enemy.getComponent<NightEnemyBody>("body");

      if (body.groundSensorsContact.size === 0) return;

      if (
        avatar &&
        movement &&
        playerInWorld &&
        !this.machine.movement.knockBack &&
        this.machine.enemy.life > 0
      ) {
        const player = playerInWorld;
        const playerBody = player.getComponent<PlayerBody>("player-body");
        const playerPosition = playerBody.body.getPosition();
  
        const nightEnemyBody =
        machine.enemy.getComponent<NightEnemyBody>("body");
        const nightEnemyPosition = nightEnemyBody.body.getPosition();
  
        const playerToNightEnemyDistance = Vec2.distance(playerPosition, nightEnemyPosition);
  
        const minDistanceToPlayerForChasing = enemies.nightEnemy.minDistanceToPlayerForChasing_enemy;
        if(playerToNightEnemyDistance < minDistanceToPlayerForChasing) {
          this.machine.state = new ChasingState(machine);
          this.machine.state.enter();
          return true;
        }
      }
    };

    const deadTransition = (machine: NightEnemyMachine) => {
      if (this.machine.enemy.dead) {
        this.machine.state = new DeadState(machine);
        this.machine.state.enter();
        return true;
      }
    };

    this.transitions.set("chase", chaseTransition);
    this.transitions.set("dead", deadTransition);
  }
  enter() {
      const nightEnemyAvatar =
          this.machine.enemy.getComponent<NightEnemyAvatar>("avatar");
      nightEnemyAvatar.avatar.play("night-idle");
  }
  update() {
    const nightEnemyBody =
    this.machine.enemy.getComponent<NightEnemyBody>("body");

    if (this.machine.enemy.life <= 0 && !this.machine.enemy.dead && !this.machine.movement.knockBack && nightEnemyBody.landed) {
      const night = this.machine.enemy;
      const scene = night.scene;
      const container = night.container;
      const nightEnemyBody =
      night.getComponent<NightEnemyBody>("body");
      nightEnemyBody.dead();
      night.dead = true;
    }
    super.update();
  }
}

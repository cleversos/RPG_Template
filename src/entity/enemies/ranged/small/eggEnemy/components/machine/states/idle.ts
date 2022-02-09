import { GameCore } from "../../../../../../../../core/game";
import { LetterSystem } from "../../../../../../../letter-system/letter-system";
import { playerInWorld } from "../../../../../../../player/player";
import { EggEnemyBody } from "../../body";
import { EggEnemyMachine } from "../machine";
import { ChasingState } from "./chasing";
import { EggEnemyState } from "./state";

export class IdleState extends EggEnemyState {
  public constructor(public machine: EggEnemyMachine) {
    super(machine);

    const chaseTransition = (machine: EggEnemyMachine) => {
      const avatar = this.machine.avatar;
      const movement = this.machine.movement;
      const body = this.machine.enemy.getComponent<EggEnemyBody>("body");

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

    this.transitions.set("chase", chaseTransition);
  }
  enter() {}
  update() {
    if (this.machine.enemy.life <= 0 && !this.machine.enemy.dead) {
      const egg = this.machine.enemy;
      const scene = egg.scene;
      const container = egg.container;

      scene.tweens.add({
        targets: [container],
        alpha: 0,
        duration: 400,
        onComplete: () => {
          egg.destroy();
          GameCore.points += 100;
          LetterSystem.enemySpawned -= 1;
        },
      });
      egg.dead = true;
    }
    if (this.machine.movement.knockBack) return;
    super.update();
  }
}

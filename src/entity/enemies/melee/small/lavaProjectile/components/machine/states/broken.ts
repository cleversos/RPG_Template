import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { adapter } from "../../../../../../../../scene/main-scene";
import { LavaProjectileAvatar } from "../../avatar";
import { LavaProjectileBody } from "../../body";
import { LavaProjectileMachine } from "../machine";
import { DeadState } from "./dead";
import { LavaProjectileState } from "./state";

export class BrokenState extends LavaProjectileState {
  public constructor(public machine: LavaProjectileMachine) {
    super(machine);

    const deadTransition = (machine: LavaProjectileMachine) => {
      if (this.machine.enemy.dead) {
        machine.state = new DeadState(machine);
        machine.state.enter();
        return true;
      }
    };

    this.transitions.set("dead", deadTransition);
  }

  enter() {
    // console.log(this.machine.eggProjectile.name + " entered BrokenState");

    const projectileBody =
      this.machine.enemy.getComponent<LavaProjectileBody>(
        "body"
      );
    const wasDestroyed = adapter.world.destroyBody(projectileBody.body);
    // console.log("was lava destroyed:", wasDestroyed);

    projectileBody.body.setGravityScale(0);
    projectileBody.body.setLinearVelocity(Vec2(0, 0));
    const eggProjectileAvatar =
      this.machine.enemy.getComponent<LavaProjectileAvatar>(
        "avatar"
      );
    eggProjectileAvatar.avatar.y =
      enemies.eggEnemy.eggProjectile.brokenTextureExtraY;

    this.startFadeTimer();
  }

  update() {
    super.update();
  }

  startFadeTimer() {
    const scene = this.machine.enemy.scene;
    const avatar = this.machine.avatar.avatar;
    const enemy = this.machine.enemy;

    scene.time.delayedCall(350, () => {
      scene.tweens.add({
        targets: avatar,
        alpha: 0,
        duration: 100,
        onComplete: () => {
          enemy.destroy();
        },
      });
    });
  }
}

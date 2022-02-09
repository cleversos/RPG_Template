import { Vec2 } from "planck-js";
import { enemies } from "../../../../../../../../helpers/vars";
import { adapter } from "../../../../../../../../scene/main-scene";
import { EggEnemy } from "../../../../../../ranged/small/eggEnemy/egg-enemy";
import { EggProjectileAvatar } from "../../avatar";
import { EggProjectileBody } from "../../body";
import { EggProjectileMachine } from "../machine";
import { EggProjectileState } from "./state";

// random chance: improve code please you get the idea



export class BrokenState extends EggProjectileState {
  public constructor(public machine: EggProjectileMachine) {
    super(machine);

    // TODO: when broken is finished, destroy
  }

  enter() {
    // console.log(this.machine.eggProjectile.name + " entered BrokenState");

    this.breakEgg();
    // this.machine.avatar.avatar.once(
    //   "animationrepeat-egg-projectile-break",
    //   () => {
    //     this.breakEgg();
    //   }
    // );
    const eggProjectileBody =
      this.machine.enemy.getComponent<EggProjectileBody>(
        "body"
      );
    const eggProjectileBodyBody = eggProjectileBody.body;
    const wasDestroyed = adapter.world.destroyBody(eggProjectileBodyBody);
    console.log("egg dsetroyed:", wasDestroyed);

    eggProjectileBodyBody.setGravityScale(0);
    eggProjectileBodyBody.setLinearVelocity(Vec2(0, 0));
    const eggProjectileAvatar =
      this.machine.enemy.getComponent<EggProjectileAvatar>(
        "avatar"
      );
    eggProjectileAvatar.avatar.play("egg-projectile-break");
    eggProjectileAvatar.avatar.y =
      enemies.eggEnemy.eggProjectile.brokenTextureExtraY;
  }

  update() {
    super.update();

  }

  breakEgg() {
    var eggChance = Math.random();
    if (eggChance < 0.2){
      new EggEnemy(this.machine.enemy.x, this.machine.enemy.y, this.machine.enemy.scene, true);
    }
  }
}

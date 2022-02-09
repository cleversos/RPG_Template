import { Vec2 } from "planck-js";
import { EggProjectileBody } from "../../body";
import { EggProjectileMachine } from "../machine";
import { BrokenState } from "./broken";
import { EggProjectileState } from "./state";

export class FlyingState extends EggProjectileState {
  public constructor(public machine: EggProjectileMachine) {
    super(machine);

    const brokenTransition = (machine: EggProjectileMachine) => {
      const avatar = this.machine.avatar;

      if (this.machine.hasCollided) {
        this.machine.state = new BrokenState(machine);
        this.machine.state.enter();
        return true;
      }
    };

    this.transitions.set("broken", brokenTransition);
  }

  enter() {
    // console.log(this.machine.eggProjectile.name + " entered FlyingState");

    this.setArcVelocity();
  }

  update() {
    super.update();
  }


  setArcVelocity() {
    const eggProjectileBody =
      this.machine.enemy.getComponent<EggProjectileBody>("body");
    const eggProjectileBodyBody = eggProjectileBody.body;
    const eggProjectilePosition = eggProjectileBodyBody.getPosition();

    
    eggProjectileBodyBody.setLinearVelocity(
      Vec2(
        this.machine.movement.speed.x * this.machine.enemy.direction,
        -this.machine.movement.speed.y
      )
    );
  }
}

import { EggProjectile } from "../../egg-projectile";
import { EggProjectileAvatar } from "../avatar";
import { FlyingState } from "./states/flying";
import { EggProjectileState } from "./states/state";
import { EnemyMachine } from "../../../../../machine";
import { EggProjectileMovement } from "../movement";

export class EggProjectileMachine extends EnemyMachine {
  public state: EggProjectileState;
  public hasCollided = false;
  public movement: EggProjectileMovement;

  public constructor(enemy: EggProjectile) {
    super(enemy);
    this.avatar = enemy.getComponent<EggProjectileAvatar>("avatar");
    this.state = new FlyingState(this);
    this.state.enter();
  }
}

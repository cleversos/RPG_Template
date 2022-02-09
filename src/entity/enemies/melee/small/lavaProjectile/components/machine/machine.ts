import { LavaProjectile } from "../../lava-projectile";
import { LavaProjectileAvatar } from "../avatar";
import { FlyingState } from "./states/flying";
import { LavaProjectileState } from "./states/state";
import { EnemyMachine } from "../../../../../machine";
import { LavaProjectileMovement } from "../movement";

export class LavaProjectileMachine extends EnemyMachine {
  public state: LavaProjectileState;
  public hasCollided = false;
  public movement: LavaProjectileMovement;

  public constructor(enemy: LavaProjectile) {
    super(enemy);
    this.avatar = enemy.getComponent<LavaProjectileAvatar>("avatar");
    this.state = new FlyingState(this);
    this.state.enter();
  }
}

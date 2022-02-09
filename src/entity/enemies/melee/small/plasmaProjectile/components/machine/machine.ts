import { PlasmaProjectile } from "../../plasma-projectile";
import { PlasmaProjectileAvatar } from "../avatar";
import { FlyingState } from "./states/flying";
import { PlasmaProjectileState } from "./states/state";
import { EnemyMachine } from "../../../../../machine";
import { PlasmaProjectileMovement } from "../movement";

export class PlasmaProjectileMachine extends EnemyMachine {
  public state: PlasmaProjectileState;
  public hasCollided = false;
  public movement: PlasmaProjectileMovement;

  public constructor(enemy: PlasmaProjectile) {
    super(enemy);
    this.avatar = enemy.getComponent<PlasmaProjectileAvatar>("avatar");
    this.state = new FlyingState(this);
    this.state.enter();
  }
}

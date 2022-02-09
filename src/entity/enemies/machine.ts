import { Enemy } from "./enemy";
import { EnemyAvatar } from "./avatar";
import { EnemyMovement } from "./movement";
import { Machine } from "../machine";

export class EnemyMachine extends Machine {
  public avatar: EnemyAvatar;
  public movement: EnemyMovement;
  public state: any;
  public hasCollided: boolean = false;
  public constructor(public enemy: Enemy) {
    super();
    this.avatar = enemy.getComponent<EnemyAvatar>("avatar");
    this.movement = enemy.getComponent<EnemyMovement>("movement");
  }

  public update() {
    if (this.state) this.state.update();
  }
}

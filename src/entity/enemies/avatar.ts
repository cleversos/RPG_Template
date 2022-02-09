import { enemies } from "../../helpers/vars";
import { EntityComponent } from "../entity";
import { Enemy } from "./enemy";

export class EnemyAvatar extends EntityComponent {
  public avatar: any;
  public constructor(
    public enemy: Enemy
  ) {
    super();
  }
}

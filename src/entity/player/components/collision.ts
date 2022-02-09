import { Shape } from "planck-js";
import { EntityComponent } from "../../entity";
import { Player } from "../player";
import { PlayerBody } from "./body";

export class PlayerCollision extends EntityComponent {
  public playerBody: PlayerBody;
  public constructor(public parent: Player) {
    super();
  }

  public start() {
    this.playerBody = this.parent.getComponent<PlayerBody>("player-body");
  }

  public updateAttackSensor(shape: Shape) {}
}

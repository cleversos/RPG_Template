import { PlayerAbilities } from "../../abilities";
import { LifespanAbility } from "../ability";
import { Fireball } from "./entity/fireball/fireball";
import { FireAbility } from "./fire";

let fireball = 0;
export class FireThree extends LifespanAbility {
  public constructor(public parent: PlayerAbilities) {
    super();
    this.init();
  }

  public init() {
    const player = this.parent.parent;
    let offsetX = this.getRandom(-500, 500);

    new Fireball(player.container.x + offsetX, 200, player.scene);
    fireball += 1;
  }

  public stack() {
    const player = this.parent.parent;
    let offsetX = this.getRandom(-500, 500);

    new Fireball(player.container.x + offsetX, 200, player.scene);
  }

  public getRandom(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min));
  }
}

import { PlayerAbilities } from "../../abilities";
import { LifespanAbility } from "../ability";
import { ThunderBall } from "./entity/thunder-ball/thunderball";

export class LightingThree extends LifespanAbility {
  public constructor(public parent: PlayerAbilities) {
    super();
    this.init();
  }

  public init() {
    const player = this.parent.parent;

    new ThunderBall(player.container.x, player.container.y, player.scene);
  }

  public stack() {
    const player = this.parent.parent;

    new ThunderBall(player.container.x, player.container.y, player.scene);
  }

  public getRandom(min: number, max: number): number {
    return min + Math.floor(Math.random() * (max - min));
  }
}

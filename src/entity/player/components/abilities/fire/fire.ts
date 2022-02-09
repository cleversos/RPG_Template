import { PlayerAbilities } from "../../abilities";
import { Ability } from "../ability";
import { FireOne } from "./fire-one";
import { FireThree } from "./fire-three";
import { FireTwo } from "./fire-two";

export class FireAbility extends Ability {
  public subAbilities: Set<Ability> = new Set();

  public constructor(public parent: PlayerAbilities) {
    super();

    // this.subAbilities.add(new FireOne(this));
    this.subAbilities.add(new FireTwo(parent));
    new FireThree(parent);
  }

  public stack() {
    this.subAbilities.forEach((a) => a.stack());
    new FireThree(this.parent);
  }

  public update() {
    this.subAbilities.forEach((a) => a.update());
  }

  public destroy() {
    this.subAbilities.forEach((a) => a.destroy());
  }
}

export enum AbilityType {
  CONSUMABLE = 0,
  LIFESPAN = 1,
}

export class Ability {
  public type: AbilityType;
  public update(): void {}
  public stack(): void {}
  public destroy(): void {}
}

export class ConsumableAbility extends Ability {
  public type: AbilityType = AbilityType.CONSUMABLE;
  public abilityAmmo: number;

  public use() {
    this.abilityAmmo -= 1;
  }
}

export class LifespanAbility extends Ability {
  public type: AbilityType = AbilityType.LIFESPAN;
}

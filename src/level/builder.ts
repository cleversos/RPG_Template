import { BaseLevel } from "./base-level";
import { collisionBuilder, LayerElement } from "./utils";

export class LevelBuilder {
  constructor(public level: BaseLevel) {}
  public buildCollision(object: LayerElement): void {
    const type = object.object.polygon
      ? "polygon"
      : object.object.rectangle
      ? "rectangle"
      : object.object.type !== ""
      ? object.object.type
      : null;
    if (!type) return;
    const builder = collisionBuilder.get(type);
    if (builder) builder(object, this);
  }
}

import Phaser from "phaser";

export class LayerElement {
  constructor(public object: Phaser.Types.Tilemaps.TiledObject) {}

  getProperty<T>(name: string): T | undefined {
    if (!this.object.properties) return undefined;
    const property = this.object.properties.find((v: any) => v.name == name);
    if (property) return property.value;
    return undefined;
  }
}

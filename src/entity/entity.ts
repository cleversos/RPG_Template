export abstract class EntityComponent {
  public awake(): void {}
  public start(): void {}
  public update(): void {}
  public destroy(): void {}
}

export class Entity {
  protected _components: Map<string, EntityComponent> = new Map();

  public awake() {
    this._components.forEach((component) => component.awake());
  }

  public start() {
    this._components.forEach((component) => component.start());
  }

  public update() {
    this._components.forEach((component) => component.update());
  }

  public destroy() {
    // console.log("destroying ocmponents");
    this._components.forEach((component) => component.destroy());
  }

  public addComponent<T extends EntityComponent>(
    name: string,
    component: T
  ): Entity {
    this._components.set(name, component);
    return this;
  }

  public getComponent<T extends EntityComponent>(name: string): T | undefined {
    return this._components.get(name) as T | undefined;
  }

  public removeComponent(name: string): Entity {
    const component = this._components.get(name);
    if (component) {
      this._components.delete(name);
      component.destroy();
    }
    return this;
  }
}

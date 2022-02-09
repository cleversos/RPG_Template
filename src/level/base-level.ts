import Phaser from "phaser";
import { EventEmitter } from "events";
import { LevelBuilder } from "./builder";

export abstract class BaseLevel {
  protected emitter: EventEmitter = new EventEmitter();
  protected builder: LevelBuilder = new LevelBuilder(this);

  constructor(public scene: Phaser.Scene) {
    scene.events.once("shutdown", this.destroy.bind(this));
  }

  protected abstract build: () => void;

  protected destroy(): void {
    this.emitter.removeAllListeners();
  }

  public on(
    eventName: string,
    listener: (...properties: any) => void
  ): EventEmitter {
    return this.emitter.on(eventName, listener);
  }

  public off(
    eventName: string,
    listener: (...properties: any) => void
  ): EventEmitter {
    return this.emitter.off(eventName, listener);
  }

  public emit(eventName: string, ...properties: any): boolean {
    return this.emitter.emit(eventName, ...properties);
  }
}

import Phaser from "phaser";
import { Buffer } from "buffer";
import { AnimationLoader, decodeChunk } from "./loader";

interface ActionMetadata {
  width: number;
  height: number;
  points: { x: number; y: number }[];
}

export class AnimationData {
  public static datas: Map<string, AnimationData> = new Map();

  public static get(scene: Phaser.Scene, animation: string) {
    let data = AnimationData.datas.get(animation);
    if (data) return data;
    if (AnimationLoader.loadedAnimation.has(animation))
      return new AnimationData(scene, animation);
    return undefined;
  }

  public actionsMetadata: Map<number, ActionMetadata> = new Map();
  public actionsFrames: Map<number, Map<number, { x: number; y: number }>> =
    new Map();

  public constructor(public scene: Phaser.Scene, public animation: string) {
    this._init();
  }

  private _init() {
    const data = Buffer.from(
      this.scene.cache.binary.get(`animation-${this.animation}-data`)
    );
    this._initActions(data);
  }

  private _initActions(data: Buffer) {
    for (let i = 0; i < data.byteLength; i) {
      const [offset, chunk] = decodeChunk(i, data);
      this._initAction(chunk);
      i = offset;
    }
  }
  private _initAction(data: Buffer) {
    const actionID = data.readUInt16LE(0);
    const [offset, metadataBuffer] = decodeChunk(2, data);

    const metadata: ActionMetadata = {
      width: metadataBuffer.readUInt16LE(0),
      height: metadataBuffer.readUInt16LE(2),
      points: [],
    };
    for (let i = 4; i < metadataBuffer.byteLength; i += 4) {
      const point = {
        x: metadataBuffer.readUInt16LE(i),
        y: metadataBuffer.readUInt16LE(i + 2),
      };
      metadata.points.push(point);
    }
    this.actionsMetadata.set(actionID, metadata);
    const actionFrames: Map<number, { x: number; y: number }> = new Map();
    const framesBuffer = data.subarray(offset, data.byteLength) as Buffer;

    let count = 0;
    while (count < framesBuffer.byteLength) {
      actionFrames.set(count / 4, {
        x: framesBuffer.readUInt16LE(count),
        y: framesBuffer.readUInt16LE(count + 2),
      });
      count += 4;
    }

    this.actionsFrames.set(actionID, actionFrames);
  }
}

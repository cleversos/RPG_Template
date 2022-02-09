import { EventEmitter } from "events";
import { Buffer } from "buffer";
import Phaser from "phaser";

enum LoaderState {
	BUSY,
	AVAILABLE,
}
export function decodeChunk(
	offset: number = 0,
	data: Buffer
): [number, Buffer] {
	const bufferLength = data.readUInt16LE(offset);
	const chunk = data.subarray(offset + 2, offset + 2 + bufferLength);
	return [offset + 2 + bufferLength, chunk as Buffer];
}
export abstract class AnimationLoader {
	public static loadingAnimation: Map<string, [Phaser.Scene, EventEmitter]> =
		new Map();
	public static loadedAnimation: Set<string> = new Set();
	public static state: LoaderState = LoaderState.AVAILABLE;

	public static startLoadAnimation(animation: string) {
		if (AnimationLoader.state !== LoaderState.AVAILABLE) return;
		const [scene, emitter] = AnimationLoader.loadingAnimation.get(animation);
		AnimationLoader.state = LoaderState.BUSY;
		if (scene) {
			scene.load
				.binary(
					`animation-${animation}-data`,
					`assets/animation/${animation}/data.bin`
				)
				.once("complete", () => {
					const data = Buffer.from(
						scene.cache.binary.get(`animation-${animation}-data`)
					);
					for (let i = 0; i < data.byteLength; i) {
						const [offset, chunk] = decodeChunk(i, data);
						if (chunk.byteLength > 0) {
							const chunkId = chunk.readUInt16LE(0);
							scene.load.image(
								`animation-${animation}-${chunkId}`,
								`assets/animation/${animation}/${chunkId}.png`
							);
							// console.log(animation, chunkId, offset);
						}

						i = offset;
					}
					scene.load.once("complete", () => {
						AnimationLoader.state = LoaderState.AVAILABLE;
						AnimationLoader.loadingAnimation.delete(animation);
						AnimationLoader.loadedAnimation.add(animation);
						AnimationLoader.onComplete();
						emitter.emit("complete");
					});
					scene.load.start();
				});
			scene.load.start();
		}
	}

	public static onComplete() {
		const entries = Array.from(AnimationLoader.loadingAnimation.entries());
		if (entries.length === 0) AnimationLoader.state = LoaderState.AVAILABLE;
		else {
			const [name, [scene, emitter]] = entries[0];
			AnimationLoader.state = LoaderState.AVAILABLE;
			AnimationLoader.startLoadAnimation(name);
		}
	}

	public static loadAnimation(scene: Phaser.Scene, animation: string) {
		const loading = AnimationLoader.loadingAnimation.get(animation);
		const loaded = AnimationLoader.loadedAnimation.has(animation);

		if (loading) return loading[1];
		if (loaded) return true;

		AnimationLoader.loadingAnimation.set(animation, [
			scene,
			new EventEmitter(),
		]);

		if (AnimationLoader.state === LoaderState.AVAILABLE) {
			AnimationLoader.startLoadAnimation(animation);
		}

		return AnimationLoader.loadingAnimation.get(animation)[1];
	}
}

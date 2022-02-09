import { EggProjectileMachine } from "../machine";

export class EggProjectileState {
	public constructor(public machine: EggProjectileMachine) { }
	public transitions: Map<string, (machine: EggProjectileMachine) => boolean> =
		new Map();
	public enter() { }
	public leave() { }
	public update() {
		const transitionsList = Array.from(this.transitions.values());
		for (let i = 0; i < transitionsList.length; i += 1) {
			const transition = transitionsList[i];
			if (transition(this.machine)) {
				this.leave();
				return;
			}
		}
	}
}

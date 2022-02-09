import { <FTName | pascalcase>EnemyMachine } from "../machine";

export class <FTName | pascalcase>EnemyState {
	public constructor(public machine: <FTName | pascalcase>EnemyMachine) { }
	public transitions: Map<string, (machine: <FTName | pascalcase>EnemyMachine) => boolean> =
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

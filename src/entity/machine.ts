export class State {
  public constructor(public machine: Machine) {}
  public transitions: Map<string, (machine: Machine) => boolean> = new Map();
  public enter() {}
  public leave() {}
  public update() {
    const transitionsList = Array.from(this.transitions.values());
    for (let i = 0; i < transitionsList.length; i += 1) {
      const transition = transitionsList[i];
      if (transition(this.machine)) {
        return;
      }
    }
  }
}

export class Machine {
  public state: State;

  public constructor() {}

  public setState(state: State) {
    if (this.state) this.state.leave();
    this.state = state;
    state.enter();
  }

  public update() {
    if (this.state) this.state.update();
  }
}

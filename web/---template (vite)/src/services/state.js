class State {
  constructor() {
    console.log("---> State()");
    if (!State.instance) {
      State.instance = this;
    }
    this.user = new User();

    return State.instance;
  }
}

class User {
  constructor() {}
}

const instance = new State();
Object.freeze(instance);
export default instance;
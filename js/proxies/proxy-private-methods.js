class Secret {
  #x = 1;

  constructor(x) {
    this.#x = x;
  }

  x() {
    return this.#x;
  }
}

const aSecret = new Secret(11);

const proxy = new Proxy(aSecret, {
  get(target, prop, receiver) {
    const value = target[prop];

    if (value instanceof Function) {
      return function (...args) {
        return value.apply(this === receiver ? target : this, args);
      };
    }

    return value;
  },
});

console.log(proxy.x());

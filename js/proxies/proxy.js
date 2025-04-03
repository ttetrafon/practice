// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
// - set traps (affect properties & methods when accessed)
// - create internal links between properties (Exotic Objects)

const target = {
  message1: "hello",
  message2: "everyone"
};

const handler = {
  /**
   * get intercepts access to objects!
   * @param {Object} target
   * @param {String} prop: property name
   * @param {Object} receiver
   */
  get(target, prop, receiver) {
    if (prop == "message2") {
      return "world";
    }

    // Reflect can be used to operate as expected by accessing the normal operation on the target.
    return Reflect.get(...arguments);
  }


};

const proxy1 = new Proxy(target, handler);
console.log(proxy1.message1, proxy1.message2);

class Secret {
  #secret

  constructor(secret) {
    this.#secret = secret;
  }

  get secret() {
    return this.#secret.replace(/\d+/, "[REDACTED]");
  }
}

const aSecret = new Secret("123456");
console.log("secret directly:", aSecret.secret);

const proxy2 = new Proxy(aSecret, {});
try {
  // Accessing a secret property in an object fails
  console.log(proxy2.secret);
} catch (error) {
  console.error(error);
}

// ... but it can still be accessed if set properly
const proxy3 = new Proxy(aSecret, {
  get(target, prop, receiver) {
    return target[prop];
  }
});
console.log("secret through proxy:", proxy3.secret);


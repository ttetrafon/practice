var evil_object = {
  foo: -1,
  set foo(foo) {
    console.log("Gotcha!");
  },
  get foo() {
    return 2;
  }
}

evil_object.foo = 1;
console.log(evil_object.foo);

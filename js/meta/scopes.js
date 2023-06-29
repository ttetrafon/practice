this_is_a_scope: {
  console.log("before...");
  break this_is_a_scope;
  console.log("after...");
}
console.log("out of scope!");

// ---------------------------------------------
// with(obj) {} limits the scope to the object, and applies all functions to it.
let people = ["Alex", "Konstantinos", "Maria"];

with (people) {
  push("Nakis");
  shift();
  console.log(people);
}

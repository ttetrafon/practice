this_is_a_scope: {
  console.log("before...");
  break this_is_a_scope;
  console.log("after...");
}
console.log("out of scope!");


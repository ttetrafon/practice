function spread(el1, el2, el3) {
  console.log(el1, el2, el3);
}

function rest(...els) {
  console.log(els);
}

spread(..."abc");
rest("a", "b", "c");

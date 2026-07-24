// A simple closure setup is the following, an outer function that returns an inner function which has access to only the outer's scope.
function outer(name) {
  let age = 30; // Variables in the closure are kept up to date. The inner function will always return the latest value of such a variable.

  function inner(name) {
    age++;
    console.log(`${name ? name : "who now?"} -> ${age}`);
  }

  return inner;
}

const func = outer();
func("Nakis");
func("Bob");
func();
func("Maria");


// function createElement(element) {
//   return () => document.createElement(element);
// }
// const createDiv = createElement("div");
// const createSpan = createElement("span");
// createDiv();
// createDiv();
// createSpan();

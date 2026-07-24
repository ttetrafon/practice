// Debounce is a decorator that delays the call of a function for a specified time
// and then triggers it with the latest input.
// Useful in webpages where some operation needs to happen
// only once after it has been triggered many times
// (e.g: trigger a request after a user finished typing in an input field).

function debounce(func, ms) {
  let timeout;
  return function wrapper() {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), ms);
  };
}

function print(text) {
  console.log(`[${ new Date() }] ${ text }`);
}

let f = debounce(print, 1000);

f("1!");
f("2!");
setTimeout(() => f("3!"), 250);
setTimeout(() => f("4!"), 100);
f("5!");

function* GeneratorFunction(range) {
  let i = 0;
  while (i < range) {
    i += 1;
    yield i;
  }
}

let iterator = GeneratorFunction(3);
console.log(iterator);

// console.log(iterator.next());
// console.log(iterator.next());
// console.log(iterator.next());
// console.log(iterator.next());

// for (const it of iterator) {
//   console.log("item: " + it);
// }

// console.log("[", ...iterator, "]");



function* idGenerator(start) {
  let i = start ? start : 0;
  while (true) {
    i += 1;
    yield `id-${i}`;
  }
}
const items = {};
const generator = idGenerator(1000);
function addItem(item) {
  const id = generator.next();
  items[id.value] = item;
}

addItem("This is an item.");
addItem([1, 2, 3, 4, 5]);
console.log(items);



function* UXDesignFlow() {
  yield showFirstButton();
  yield showSecondButton();
  yield window.location.reload();
}

function runSequence() {
  const uxIterator = UXDesignFlow();
  uxIterator.next();

  firstButton.on('click', () => {
    // do something...
    uxIterator.next();
  });

  secondButton.on('click', () => {
    // do something...
    uxIterator.next();
  });
}


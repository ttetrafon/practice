// A generator is marked with `function*`
function* numbers() {
  let i = 0;
  while (true) yield i++;
}

const num = numbers();

for (let i = 0; i < 5; i++) {
  console.log(num.next());
}

// Array methods can also be applied to iterators, but they need to know when to finish
console.log(
  num.map(n => n * 2).take(3).toArray()
);

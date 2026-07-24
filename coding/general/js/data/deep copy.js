// Simplistic deep copy of data structures
function deepCopy(obj) {
  if (!obj || typeof(obj) != 'object') {
    return obj;
  }

  let res;
  if (obj instanceof Array) {
    res = [];
    obj.forEach(element => {
      res.push(deepCopy(element));
    });

  }
  else {
    res = {};
    Object.keys(obj).forEach(key => {
      res[key] = deepCopy(obj[key]);
    });
  }
  return res;
}

objects = [
  5,
  "I am a string...",
  [1, 2, 3],
  { "a": 5, "b": 6 },
  { "a": 5, "b": { "c": 15, "d": [1, 4, 8] } }
];
objects.forEach(
  (item) => {
    console.log(item, "->", deepCopy(item));
  }
);


console.log("--------------------");

// the native way
// https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone
const original = {
  name: "Nakis",
  age: 30,
  hobbies: [
    "hiking",
    "chess",
    "sailing"
  ]
};
original.itself = original;

const clone = structuredClone(original);
console.assert(clone !== original); // the objects are not the same (not same identity)
console.assert(clone.name === "Nakis"); // they do have the same values
console.assert(clone.hobbies.length === 3);
console.assert(clone.hobbies !== original.hobbies);
console.assert(clone.itself === clone); // and the circular reference is preserved

clone.hobbies.push("swimming");
console.log(original, clone);


console.log("--------------------");

class Person {
  constructor(name, age, hobbies) {
    this.name = name;
    this.age = age;
    this.hobbies = hobbies;
  }

  whoIs() {
    console.log(`${this.name} is ${this.age} years old and practices ${JSON.stringify(this.hobbies)}.`);
  }
}

const first = new Person("Nakis", 25, ["swimming", "coding"]);
const second = structuredClone(first);
console.log(first, second);
console.log("types:", typeof(first), typeof(second));

first.whoIs();
// second.whoIs(); // Note that structuredCopy does not transfer methods!

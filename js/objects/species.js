// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#species

class MyArray extends Array {
    // Overwrite species to parent Array constructor
    // so that the derived class the parent instead
    // of the derived class when appropriate.
    static get [Symbol.species]() { return Array }
}

let a = new MyArray(1, 2, 3);
let squared = a.map(x => x * x);

console.log(`squared instance of Array: ${squared instanceof Array}`);
console.log(`squared instance of MyArray: ${squared instanceof MyArray}`);

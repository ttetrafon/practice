
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#sub_classing_with_extends
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#super_class_calls_with_super

// CLASS
class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a noise!`);
    }
}

class Dog extends Animal {
    constructor(name) {
        super(name);
    }

    speak() {
        console.log(`${this.name} barks!`);
        super.speak(); // super.method() can be used to invoke the parent's overwritten method.
    }
}

let animal = new Animal("Misty");
let dog = new Dog("Doggy");

animal.speak();
dog.speak();


// OBJECT
const Human = {
    speak() {
        console.log(`${this.name} speaks!`);
    }
}

class Child {
    constructor(name) {
        this.name = name;
    }
}

Object.setPrototypeOf(Child.prototype, Human);

let c = new Child("Bob");
c.speak();

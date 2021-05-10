class Person {
    constructor(name, address, hobbies) {
        this.name = name;
        this.address = address;
        this.hobbies = hobbies;
    }

    print() {
        console.log("person:", this);
    }

    printName() {
        console.log("name: ", this.name);
    }

    printStreet() {
        // The ? after the name of an object when trying to access one of its properties will return 'undefined' if the object does not exist, instead of throwing an error.
        console.log("street: ", this.address?.street);
    }
}

const ttetrafon = new Person("ttetrafon", {street: "St. John's Walk", city: "Birmingham"}, ["js", "karate"]);
ttetrafon.print();
ttetrafon.printStreet();
ttetrafon.printName();
ttetrafon.printHobbies?.(); // ?.() after a method name checks if the function exists and is a function before attempting to execute it.

const thomeless = new Person("thomeless", null, ["js", "karate"]);
thomeless.print();
thomeless.printStreet();
console.log("hobbies[1]:", thomeless.hobbies?.[1]); // ?.[index] after a list will check if the item at the indicated index exists and will return undefined if it does not instead of throwing an error.
console.log("hobbies[3]:", thomeless.hobbies?.[3]);

class MyClass {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    toString() {
        return this.name + ": " + this.value;
    }
}

const obj = new MyClass("ttetrafon", 5);
console.log(obj.toString());

class ChildClass extends MyClass {
    constructor(name, value, flag) {
        super(name, value);
        this.flag = flag;
    }

    toString() {
        return this.name + ": " + this.value + " -> " + this.flag;
    }
}

const child = new ChildClass("ttetrafon", 11, true);
console.log(child.toString());

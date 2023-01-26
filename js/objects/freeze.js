"use strict" // without this it won't throw an error, but still fail to update the object.

const person = {
  name: "Tr",
  age: 45
};
person = Object.freeze(person); // NOTE: freeze is not applied recursively!!!

person.name = "Banana";

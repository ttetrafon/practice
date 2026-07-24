const person = {
  firstName: "John",
  hobbies: [
    "Swimming",
    "Chess",
    "Cycling"
  ]
};

// Requires node 17+
if (typeof structuredClone !== "undefined") {
  var personCloned = structuredClone(person);
}
else {
  console.log("... 'structuredClone()' is not defined here...");
  var personCloned = { ...person };
}

console.log("cloned person: ", personCloned);

person.hobbies.push("Reading");
console.log("cloned person: ", personCloned);

console.log("person == personCloned: ", person == personCloned);
console.log("person.hobbies == personCloned.hobbies: ", person.hobbies == personCloned.hobbies);

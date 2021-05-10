var person = {
    firstname: "ttetrafon",
    surname: "B",
    birthday: new Date("15 Jan 2000")
};

const { firstname } = person; // equivalent to `const firstname = person.firstname;`
console.log("first name:", firstname);

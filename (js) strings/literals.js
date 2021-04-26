var person = {
    firstname: "ttetrafon",
    surname: "B",
    birthday: new Date("15 Jan 2000")
};

console.log(
    `Name: ${person.firstname} ${person.surname}; Birthday: ${person.birthday.toISOString()}`
);

var person = {
    firstname: "ttetrafon",
    surname: "B",
    birthday: new Date("15 Jan 2000")
};

console.log(
    `Name: ${person.firstname} ${person.surname}; Birthday: ${person.birthday.toISOString()}`
);

// ------------------------------------------------------------------------------------------------------------
function lit_fun(strings, ...values) {
    console.log("---> custom()", strings, values);
    return values.reduce((finalstring, value, index) => {
        return `${finalstring}<strong>${value}</strong>${strings[index + 1]}`
    }, strings[0]);
}

console.log(lit_fun`Name: ${person.firstname} ${person.surname}; Birthday: ${person.birthday.toISOString()}`);

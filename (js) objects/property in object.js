person = {
    nickname: "ttetrafon",
    email: "ttetrafon@yahoo.gr"
};

if ("email" in person) { // Similar to `person.hasOwnProperty("email")`.
    console.log("email: ", person.email);
}
else {
    console.log("no email found...");
}

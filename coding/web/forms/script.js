const title = document.querySelector("title");
console.log(title.text + " script started...");

// Can get number fields as numbers directly
const ageField = document.getElementById("age");
let age = ageField.valueAsNumber;

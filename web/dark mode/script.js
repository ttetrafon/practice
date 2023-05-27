const title = document.querySelector("title");
console.log(title.text + " script started...");

var body = document.querySelector("body");
var button = document.querySelector("button");

button.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  body.classList.toggle("dark-mode");
});

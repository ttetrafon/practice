const title = document.querySelector("title");
console.log(title.text + " script started...");

document.body.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

const title = document.querySelector("title");
console.log(title.text + " script started...");

const container = document.querySelector("#container");
container.innerText = "No message yet...";

parent.addEventListener("message", event => {
  console.log(event);
  console.log(event.origin);
  console.log(event.data);
  container.innerText = event.data;
});

const title = document.querySelector("title");
console.log(title.text + " script started...");

let p = document.querySelector("p");
fetch("./data.json")
  .then(res => res.json())
  .then((json) => {
    p.innerText = json.text;
  });

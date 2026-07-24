const title = document.querySelector("title");
console.log(title.text + " script started...");

const addElementBtn = document.getElementById("add-element");
const removeElementBtn = document.getElementById("remove-element");
const container = document.getElementById("container");

addElementBtn.addEventListener("click", _ => {
  let box = document.createElement("div");
  box.classList.add("box");
  container.appendChild(box);
});

removeElementBtn.addEventListener("click", _ => {
  let n = container.children.length;
  if (n > 0) container.children[n - 1].remove();
});


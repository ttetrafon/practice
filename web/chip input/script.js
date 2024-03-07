const title = document.querySelector("title");
console.log(title.text + " script started...");

const ul = document.querySelector("ul");
const input = document.querySelector("input");
const choicesContainer = document.querySelector(".choices");
let tags = [];
const choices = [
  "html",
  "js",
  "css",
  "java",
  "python",
  "css1",
  "css2",
  "css3",
  "css4",
  "css5",
  "css6",
  "css7",
  "css8",
  "css9",
  "css0"
];

function clearChildren(parent) {
  while(parent.firstChild) {
    parent.removeChild(parent.lastChild);
  }
}

function createTag(value) {
  tags.push(value);
  input.value = "";
  let tag = document.createElement("li");

  let span = document.createElement("span");
  span.innerText = value;
  tag.appendChild(span);

  let img = document.createElement("img");
  img.setAttribute("src", "./img/close_FILL0_wght100_GRAD0_opsz24.svg");
  tag.appendChild(img);
  img.addEventListener("click", (event) => {
    event.stopPropagation();
    let value = event.target.previousSibling.innerText;

    tags.splice(tags.indexOf(value), 1);
    event.target.parentElement.remove();
  });

  choicesContainer.classList.add("hidden");
  ul.insertBefore(tag, input);
}

function createChoices(value) {
  clearChildren(choicesContainer);

  if (value.length > 0) {
    choicesContainer.classList.remove("hidden");
  }
  else {
    choicesContainer.classList.add("hidden");
    return;
  }

  choices.filter(el => el.includes(value)).forEach((choice) => {
    let p = document.createElement("p");
    p.innerText = choice;
    p.addEventListener("click", (event) => {
      event.stopPropagation();
      createTag(event.target.innerText);
      choicesContainer.classList.add("hidden");
    });

    choicesContainer.appendChild(p);
  });
}

function addTag(event) {
  let text = event.target.value;
  createChoices(text);

  if (event.key == "Enter") {
    if (text.length <= 1 || tags.includes(text)) return;
    createTag(text);
  }
}

input.addEventListener("keyup", (event) => {
  event.stopPropagation();
  addTag(event);
});

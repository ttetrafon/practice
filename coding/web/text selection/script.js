const title = document.querySelector("title");
console.log(title.text + " script started...");

const button = document.querySelector("button");
button.addEventListener("click", _ => {
  let selection = document.getSelection();
  // let selection = window.getSelection();
  console.log(selection);
  console.log(selection.toString());
});

document.addEventListener("selectionchange", (event) => {
  console.log("document:", document.getSelection().toString());
});

const textArea = document.querySelector("textarea");
textArea.addEventListener("selectionchange", (event) => {
  // NOTE: Doesn't work on all browsers...
  event.stopPropagation();
  console.log("textarea:", document.getSelection().toString());
});

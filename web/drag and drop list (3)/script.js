console.log("main script started...");
const draggableItems = document.querySelectorAll(".draggable");

let dragging = null;
let over = null; // reference to the element we are dragging over
let container = null; // reference to the parent of the element we are dragging over
let nextSibling = null; // reference to the next sibling of the dragging element
let under = true; // determines the position of the movement, under or above the element we are dragging over
let indicator = document.createElement("hr"); // a line indicator to show where the dragging element will be dropped

draggableItems.forEach(draggable => {
  draggable.addEventListener("dragstart", (event) => {
    dragging = event.target;
    draggable.classList.add("dragging");
  });
  draggable.addEventListener("dragend", _ => {
    draggable.classList.remove("dragging");
    finishDrag();
  });
  draggable.addEventListener("dragenter", (event) => {
    // console.log("dragenter...");
    over = event.target;
    // console.log(over);
    container = over.parentNode;
    // console.log(container);
    nextSibling = over.nextElementSibling;
    // console.log(nextSibling);
  });
  draggable.addEventListener("dragexit", _ => {
    // console.log("dragexit...");
  });
  draggable.addEventListener("dragover", (event) => {
    event.preventDefault();

    let box = over.getBoundingClientRect();
    // console.log("box:", box);

    // let offsetX = event.clientX - box.left - box.width / 2;
    // console.log("offsetX:", offsetX);
    let offsetY = event.clientY - box.top - box.height / 2;
    // console.log("offsetY:", offsetY);

    under = offsetY > 0
    addIndicator();
  })
});

function addIndicator() {
  indicator.remove();
  if(under) {
    if (nextSibling) container.insertBefore(indicator, nextSibling);
    else container.appendChild(indicator);
  }
  else {
    container.insertBefore(indicator, over);
  }
}

function finishDrag() {
  container.insertBefore(dragging, indicator);
  indicator.remove();

  dragging = null;
  over = null;
  container = null;
  nextSibling = null;
  under = null;
}

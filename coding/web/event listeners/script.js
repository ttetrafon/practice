console.log("main script started...");

const button = document.getElementById("single");

button.addEventListener("click",
  () => {
    alert("Single time event triggered :)");
  },
  {
    // An event listener can be removed automatically after one use.
    // Otherwise, event listeners can be removed manually at any point, but they require a reference to the callback function.
    once: true
  }
);


const grandparent = document.querySelector(".grandparent");
const parent = document.querySelector(".parent");
const child = document.querySelector(".child");

function debugEvent(event, name, type) {
  console.log(name + " (" + type + ") clicked!");
  console.log(event.target);
}

// Events are triggered along the line in all elements, unless propagation is stopped.
// Propagation has two phases: "capture" starts from the document and goes through the html tree until it reaches the element that triggered the event,
// and "bubbling" starts from the element itself and moves up the html tree until it reaches the document.
// The same event can be registered multiple times on the same element...
grandparent.addEventListener("click", (event) => {
  debugEvent(event, "grandparent", "capture");
}, {
  capture: true
});
grandparent.addEventListener("click", (event) => {
  debugEvent(event, "grandparent", "bubble");
});

parent.addEventListener("click", (event) => {
  debugEvent(event, "parent", "capture");
}, {
  capture: true
});
parent.addEventListener("click", (event) => {
  debugEvent(event, "parent", "bubble");
  // The propagation can be stopped at any time through the event itself. This stops both capture and bubbling.
  event.stopPropagation();
});

// Capture and Bubbling may be reversed on the actual trigger element if registered on the wrong order.
child.addEventListener("click", (event) => {
  debugEvent(event, "child", "capture");
});
child.addEventListener("click", (event) => {
  debugEvent(event, "child", "bubble");
}, {
  capture: true
});

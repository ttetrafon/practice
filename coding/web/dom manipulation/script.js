const title = document.querySelector("title");
console.log(title.text + " script started...");

// Add elements in the page
const body = document.body;
// - Append can be used to append anything, even simple strings.
// body.append("Hello world!", document.createElement("br"), "Bye!");
// - Elements should be added with .appendElement
const el1 = document.createElement("div");
el1.textContent = "This is el1's text!";
body.appendChild(el1);

const el2 = document.createElement("div");
el2.innerHTML = "<strong>This is el2's text!</strong>";
body.appendChild(el2);

const el3 = document.createElement("div");
const el3Strong = document.createElement("i");
el3Strong.textContent = "This is el3's text!";
el3.appendChild(el3Strong);
body.appendChild(el3);

const container = document.querySelector("#container");
const hi = document.getElementById("hi");
const bye = document.getElementById("bye");
// To remove an element either use 'element.remove()' or 'parent.removeChild(element)'
setTimeout(() => {
  // bye.remove();
  container.removeChild(bye);
}, 2000);

// Get, change, and remove an element's attributes with '.getAttribute(attr)', '.updateAttribute(attr, value)', and '.removeAttribute(attr)'.
console.log("hi.title =", hi.getAttribute("title"));
// Common attributes can be accessed through methods named after themselves.
console.log("hi.id =", hi.id);
setTimeout(() => {
  hi.setAttribute("title", "Goodbye World!");
}, 3000);

// Data attributes (data-#) can be similarly manipulated.
console.log("hi.dataset:", hi.dataset);
console.log("hi.dataset.secondaryDatum =", hi.dataset.secondaryDatum);
hi.dataset.newName = "Some name this is...";
console.log(hi);

// Manipulate classes through .classList methods.
const classTest = document.querySelector("#class-test");
classTest.classList.add("red", "bold");
console.log("classTest.classList:", classTest.classList);
setTimeout(() => {
  classTest.classList.toggle("bold");
  // .toggle(class, true/false): true -> add the class always, false -> remove the class always
  // Can also use .add and .remove instead of the toggle(..., true/false)
}, 5000);

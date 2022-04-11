import './modal1.js';
import './modal2.js';
import './html-template.js';
import './button.js';
// console.log("main script started...");

const buttonWrapper = document.getElementById("my-btn-wrapper");
const myButton = document.getElementById("my-button-1");
buttonWrapper.addEventListener('onClick', (event) => {
  console.log("my-button clicked:", event);
  console.log(myButton);
  myButton.label = "Oh, you clicked me!";
  setTimeout(() => {
    myButton.label = "Click me again!!!";
  }, 2500);
});

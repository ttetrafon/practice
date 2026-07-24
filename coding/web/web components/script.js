import './modal1.js';
import './modal2.js';
import './html-template.js';
import './button.js';
import './dropdown.js';
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

const myDropdownWrapper = document.getElementById("my-dropdown-wrapper");
const myDropdown = document.querySelector("my-dropdown");
myDropdown.options = {
  option1: { label: 'Option 1' },
  option2: { label: 'Option 2' },
  option3: { label: 'Option 3' }
};
myDropdown.addEventListener('onChange', (event) => {
  console.log("myDropdown.onChange: key=" + event.detail);
});
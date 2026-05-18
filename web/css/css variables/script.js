const title = document.querySelector("title");
console.log(title.text + " script started...");

// We can retriever the values of css properties:
var style = getComputedStyle(document.body);
const light = style.getPropertyValue("--background");
const dark = style.getPropertyValue("--foreground");
const textBaseSize = style.getPropertyValue("--text-base-size");
console.log(light, dark, textBaseSize);

// And we can update them as needed.
setTimeout(() => {
  document.documentElement.style.setProperty("--text-base-size", '2rem');
  document.documentElement.style.setProperty("--background", dark);
  document.documentElement.style.setProperty("--foreground", light);
}, 5000);

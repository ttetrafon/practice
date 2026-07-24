const title = document.querySelector("title");
console.log(title.text + " script started...");


var slider = document.querySelector("input");
var par = document.querySelector("p");

function updateValue() {
  par.textContent = slider.value;
}
updateValue();

slider.addEventListener("change", (event) => {
  console.log(event);
  updateValue();
});

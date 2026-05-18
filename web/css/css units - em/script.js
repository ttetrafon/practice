const title = document.querySelector("title");
console.log(title.text + " script started...");

var slider = document.getElementById('slider'),
    mod = document.getElementById('mod'),
    op = document.getElementById('op');

slider.onchange = function () {
  mod.style.fontSize = this.value + 'px';
  op.innerHTML = this.value + 'px';
}
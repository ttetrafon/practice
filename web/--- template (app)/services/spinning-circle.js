const spinningCircle = document.createElement("loading-circle");
document.body.appendChild(spinningCircle);
spinningCircle.classList.add("hidden");

document.addEventListener("toggle-spinning-circle", (event) => {
  event.stopPropagation();
  spinningCircle.classList.toggle("hidden", !event.detail.state);
});

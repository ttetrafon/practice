const title = document.querySelector("title");
console.log(title.text + " script started...");

const $container = document.getElementById("container");

function createSvg(filled) {
  console.log(`---> Proficiency.createSvg(${filled})`);
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("height", 20);
  svg.setAttribute("width", 20);

  let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", 7);
  circle.setAttribute("cy", 7);
  circle.setAttribute("r", 6);
  circle.setAttribute("stroke", "var(--foreground)");
  circle.setAttribute("stroke-width", 1);
  circle.setAttribute("fill", filled ? "var(--foreground)" : "var(--background)");

  svg.appendChild(circle);
  $container.appendChild(svg);
}


createSvg(true);
createSvg(true);
createSvg(false);
createSvg(false);
createSvg(false);

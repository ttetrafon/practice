const title = document.querySelector("title");
console.log(title.text + " script started...");

const container = document.querySelector("div");

const images = [
  "image-1.png",
  "image-2.jpg",
  "image-3.jpg",
  "image-4.jpg"
];

let currentIndex = 0;
let img = document.createElement("img");
img.src = `./img/${images[currentIndex]}`;
container.appendChild(img);

function updateImage() {
  let newIndex = (currentIndex + 1) % images.length;

  let currentImage = document.querySelector("img");

  let newImage = document.createElement("img");
  newImage.src = `./img/${images[newIndex]}`;
  container.appendChild(newImage);

  currentImage.classList.add("slide");
  newImage.classList.add("slide");

  currentIndex = newIndex;
  setTimeout(() => {
    currentImage.remove();
    newImage.classList.remove("slide");
  }, 3100);
}

setInterval(() => {
  updateImage();
}, 6000);

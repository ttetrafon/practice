console.log("main script started...");

const button = document.querySelector("button");
console.log(button);

button.addEventListener("click",
  () => {
    alert("Single time event triggered :)");
  },
  {
    once: true
  }
);

console.log("started...");

let index = 0;
let interval = setInterval(() => {
  console.log(`[${index++}] repeating...`);
}, 1000);

setTimeout(() => {
  clearInterval(interval);
  console.log("stopped...");
}, 10000);

console.log("ended...");

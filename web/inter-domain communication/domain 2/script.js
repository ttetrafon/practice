const title = document.querySelector("title");
console.log(title.text + " script started...");

const btn = document.querySelector("button");
btn.addEventListener("click", event => {
  parent.postMessage(`user=Nakis${Math.random()}`, "http://127.0.0.1:5500/web/inter-domain%20communication/domain%201/index.html");
});

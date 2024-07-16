const title = document.querySelector("title");
console.log(title.text + " script started...");

const url = "http://127.0.0.1:8000/ws";
const connectBtn = document.getElementById("connect");
const h2 = document.querySelector("h2");
const container = document.querySelector("article");
const form = document.querySelector("form");
const input = document.querySelector("input");

let ws;
let client_id = crypto.randomUUID();
h2.innerText = client_id;

connectBtn.addEventListener("click", () => {
  ws = new WebSocket(`${url}/${client_id}`);

  ws.addEventListener("message", (ev) => {
    if (ev.data.includes(client_id)) {
      return;
    }

    let msg = document.createElement("div");
    msg.innerText = ev.data;
    container.appendChild(msg);
  });

  connectBtn.setAttribute("disabled", true);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopPropagation();
  console.log("...");

  let msg = `${input.value.trim()}`;
  console.log(ws, msg);
  ws.send(msg);

  return false;
});

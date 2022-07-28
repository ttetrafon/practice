console.log("main script started...");

const url = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";

const headers = {
  "accept": "application/json"
};

let button = document.querySelector("button");
let textDisplay = document.querySelector("p");

button.addEventListener("click", async () => {
  console.log("button clicked :P");
  let request = new Request(url, { method: 'GET', headers: headers, mode: "cors" });
  console.log("request:", request);
  let response = await fetch(request);
  console.log("response:", response);
  let data = await response.text();
  console.log("data:", data);
});

function writeText(text) {
  textDisplay.innerText = text;
}

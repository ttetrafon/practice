console.log("main script started...");

const url = "https://dog.ceo/api/breeds/image/random";

const headers = {
  "accept": "application/json"
};

let button = document.querySelector("button");
let imgDisplay = document.querySelector("img");

button.addEventListener("click", async () => {
  console.log("button clicked :P");
  let request = new Request(url, { method: 'GET', headers: headers, mode: "cors" });
  console.log("request:", request);
  let response = await fetch(request);
  console.log("response:", response);
  let data = await response.text();
  data = JSON.parse(data);
  console.log("data:", data);
  displayImage(data.message);
});

function displayImage(img_url) {
  console.log(`displayImage(${img_url})`)
  imgDisplay.src = img_url;
}

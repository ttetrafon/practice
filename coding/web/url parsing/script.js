const title = document.querySelector("title");
console.log(title.text + " script started...");

const pathname = document.getElementById("pathname");
pathname.innerText = window.location.pathname;

const search = document.getElementById("search");
search.innerText = window.location.search;
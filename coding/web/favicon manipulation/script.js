const title = document.querySelector("title");
console.log(title.text + " script started...");

const favicon = document.querySelector('link[rel="icon"]');

document.addEventListener("visibilitychange", () => {
  const hidden = document.hidden;

  favicon.setAttribute("href", (hidden ? './img/Avatar - inverted.jpg' : './img/Avatar.jpg'));
});

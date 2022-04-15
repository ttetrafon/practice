console.log("main script started...");

const mab = document.querySelectorAll(".mab");
console.log("mab:", mab);

mab.forEach(multiAction => {
  const menuButton = multiAction.querySelector(".mab__button--menu");
  console.log("menuButton:", menuButton);
  const list = multiAction.querySelector(".mab__list");
  console.log("list:", list);

  menuButton.addEventListener("click", _ => {
    console.log("menu button clicked!");
    list.classList.toggle("mab__list--visible");
    console.log(list.classList);
  });
});

document.addEventListener("click", (event) => {
  console.log("clicked on:", event.target, event.target.closest(".mab__button--menu"));
  const keepOpen = event.target.matches(".mab__list") || event.target.matches(".mab__button--menu") || event.target.closest(".mab__button--menu");
  if (keepOpen) {
    return;
  }

  document.querySelectorAll(".mab__list").forEach(list => {
    list.classList.remove("mab__list--visible");
  });
});
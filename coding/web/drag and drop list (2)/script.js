console.log("main script started...");
const draggableItems = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".container");

draggableItems.forEach(draggable => {
  draggable.addEventListener("dragstart", _ => {
    draggable.classList.add("dragging");
  });
  draggable.addEventListener("dragend", _ => {
    draggable.classList.remove("dragging");
  });
});

containers.forEach(container => {
  container.addEventListener("dragover", e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement) container.insertBefore(draggable, afterElement);
    else container.appendChild(draggable);
  });
});

function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll(".draggable:not(.dragging)")];
  return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
    else return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

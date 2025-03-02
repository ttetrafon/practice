import { eventNames } from "../data/enums.js";

export async function clearChildren(parent) {
  while(parent.firstChild) {
    parent.removeChild(parent.lastChild);
  }
}
export async function clearChildrenOfType(parent, tag) {
  for (let i = parent.children.length - 1; i >= 0; i--) {
    if ((parent.children[i].nodeName).toLowerCase() === tag) parent.children[i].remove();
  }
}
export async function clearChildrenOfClass(parent, className) {
  for (let i = parent.children.length - 1; i >= 0; i--) {
    if (parent.children[i].classList.contains(className)) parent.children[i].remove();
  }
}

/**
 *
 * @param {HTMLElement} self
 * @param {HTMLElement} parent
 */
export async function findSelfIndexInParent(self, parent) {
  let element = self;
  let index = 0;
  while (element.previousElementSibling) {
    element = element.previousElementSibling;
    index++;
  }
  return index;
}

/**
 * Creates options within a select element.
 * @param {HTMLElement} selector
 * @param {Array[Object]} options
 * @param {string} valueKey
 * @param {string} textKey
 */
export async function populateSelectorOptions(selector, options, valueKey, textKey) {
  if (!options) return;
  options.forEach(option => {
    let opt = document.createElement("option");
    opt.value = option[valueKey]
    opt.innerText = option[textKey];
    selector.appendChild(opt);
  });
}
/**
 * Sets the date in the input to today by default.
 * @param {HTMLElement} dateInput
 */
export async function setDateInputAsToday(dateInput) {
  const today = new Date();

  // Format the date as yyyy-mm-dd
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  dateInput.value = `${year}-${month}-${day}`;
}

export async function emitCustomEvent(that, eventName, eventDetails) {
  that.dispatchEvent(new CustomEvent(eventName, {
    bubbles: true,
    composed: true,
    detail: eventDetails
  }));
};
export async function toggleSpinningCircle(that, state) {
  emitCustomEvent(that, eventNames.TOGGLE_SPINNING_CIRCLE.description, {
    bubbles: true,
    composed: true,
    state: state
  });
}
export async function emitNavigationEvent(that, target) {
  emitCustomEvent(that, eventNames.NAVIGATE.description, {
    bubbles: true,
    composed: true,
    target: target
  });
}
/**
 * @param {HTMLElement} that
 * @param {String} route
 */
export async function emitSubPageContainerEvent(that, route) {
  setTimeout(() => {
    emitCustomEvent(that, eventNames.SUB_PAGE_CONTAINER.description, {
      bubbles: true,
      composed: true,
        container: that,
      route: route
    });
  }, 0);
}

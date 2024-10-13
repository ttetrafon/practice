const title = document.querySelector("title");
console.log(title.text + " script started...");

// https://github.com/codex-team/editor.js

const blockElements = [ // Full line (block) elements.
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p"
];
const spanElements = [ // Formatting elements.
  "span",
  "b",
  "i",
  "u"
];

/**
 * Recursively travels upwards the dom tree from the input node to find the first enclosing block.
 * @param { HTMLElement } node
 * @returns { HTMLElement | undefined }
 */
function findEnclosingBlock(node) {
  console.log("---> findEnclosingBlock()", node);
  let res = node.parentElement;
  if (blockElements.includes(res.nodeName.toLowerCase())) {
    return res;
  }
  else {
    console.log("... moving to parent");
    return findEnclosingBlock(res);
  }
}

/**
 * Looks for the element that defines the current block (line), depending on the caret's current position.
 * @returns { HTMLElement | undefined }
 */
function getCurrentBlock() {
  console.log("---> getCurrentBlock()");
  let node = window.getSelection().anchorNode;
  console.log("... anchor node:", node);
  if (node) {
    return findEnclosingBlock(node);
  }
}

/**
 * Recursively travels upwards the dom tree from the input node to find the first enclosing span.
 * @param { HTMLElement } node
 * @returns { HTMLElement }
 */
function findEnclosingSpan(node) {
}

/**
 * Looks for the element that defines the current span, depending on the caret's current position.
 * @returns { HTMLElement }
 */
function getCurrentSpan() {
  console.log("---> getCurrentSpan()");
  let node = window.getSelection();

}

/**
 *
 * @returns
 */
function getSelectionRange() {
  console.log("---> getSelectionRange()");
  const selection = window.getSelection();
  console.log(selection);
  let res;
  if (selection.rangeCount > 0) {
    res = selection.getRangeAt(0);
  }
  console.log(`selection: ${res}`);
  return res;
}

/**
 * Takes a node and replaces it's tag with a new one, preserving all content and attributes.
 * @param { HTMLElement } node
 * @param { string } newNodeName
 */
function replaceTag(node, newNodeName) {
  console.log(`---> replaceTag(${newNodeName})`, node)
  // abort if the node is the same
  if (node.nodeName.toLowerCase() == newNodeName) return;

  // get the contents
  let content = node.innerHTML;
  console.log("content:", content);
  node.innerHTML = null;

  // create the new element
  let newElement = document.createElement(newNodeName);
  newElement.innerHTML = content;
  newElement.classList = node.classList;
  newElement.id = node.id;
  console.log("new element:", newElement);

  // replace the old element with the new one
  node.parentElement.insertBefore(newElement, node);
  node.remove();
}

/**
 * Triggers a block event from an appropriate button.
 * This results in changing this block's tag to the one defined by the triggering button.
 * @param { String } nodeName
 */
function blockEvent(nodeName) {
  let currentBlock = getCurrentBlock();
  console.log("currentBlock:", currentBlock);
  replaceTag(currentBlock, nodeName);
}


const h1Btn = document.getElementById("heading1");
const h2Btn = document.getElementById("heading2");
const h3Btn = document.getElementById("heading3");
const h4Btn = document.getElementById("heading4");
const h5Btn = document.getElementById("heading5");
const h6Btn = document.getElementById("heading6");
const textBtn = document.getElementById("text");
const boldBtn = document.getElementById("bold");

h1Btn.addEventListener("click", (event) => {
  event.stopPropagation();
  blockEvent("h1");
});
h2Btn.addEventListener("click", (event) => {
  event.stopPropagation();
  blockEvent("h2");
});
h3Btn.addEventListener("click", (event) => {
  event.stopPropagation();
  blockEvent("h3");
});
h4Btn.addEventListener("click", (event) => {
  event.stopPropagation();
  blockEvent("h4");
});
h5Btn.addEventListener("click", (event) => {
  event.stopPropagation();
  blockEvent("h5");
});
h6Btn.addEventListener("click", (event) => {
  event.stopPropagation();
  blockEvent("h6");
});
text.addEventListener("click", (event) => {
  event.stopPropagation();
  blockEvent("p");
});

boldBtn.addEventListener("click", (event) => {
  event.stopPropagation();

  let range = getSelectionRange();
  if (!range) return;

  const selectedText = range.extractContents();
  let wrapper = document.createElement("b");
  wrapper.appendChild(selectedText);
  range.insertNode(wrapper);
});

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
 * @returns { Object } { span: enclosing-span, block: enclosing-block }
 */
function findEnclosingElement(node) {
  console.log("---> findEnclosingElement()", node);
  let res = node.parentElement;
  if (spanElements.includes(res.nodeName.toLowerCase())) {
    return {
      "span": res
    };
  }
  else if (blockElements.includes(res.nodeName.toLowerCase())) {
    return {
      "block": res
    };
  }
  else {
    console.log("... moving to parent");
    return findEnclosingElement(res);
  }
}

/**
 *
 * @returns { Object }
 */
function getSelectionRange() {
  console.log("---> getSelectionRange()");
  let selection = window.getSelection();
  console.log(selection);

  return {
    "type": selection.type,
    "anchorNode": selection.anchorNode,
    "range": selection.type == "Range" ? selection.getRangeAt(0) : undefined
  };
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

/**
 * Triggered from a span event from the appropriate button.
 * Two possibilities:
 * (1) Selection has occurred (type = "Range")
 * (2) Caret is at specific position (type = "Caret").
 * @param { String } nodeName
 */
function spanEvent(nodeName) {
  console.log(`---> spanEvent(${nodeName})`);
  let selection = getSelectionRange();
  console.log("selection:", selection);
  let enclosingElement = findEnclosingElement(selection.anchorNode);
  console.log("enclosingElement:", enclosingElement);

  if (selection.type == "Caret") {
    console.log(`... type=${selection.type}: caret`);
    // may find either a span or a block
    // ... on a span, we replace, if it is the same, we remove it and finish
    if (enclosingElement.span && enclosingElement.span.nodeName.toLowerCase() == nodeName) {
      console.log("... removing span!");
      while (enclosingElement.span.firstChild) {
        enclosingElement.span.parentElement.insertBefore(enclosingElement.span.firstChild, enclosingElement.span);
      }
      enclosingElement.span.remove();
    }
    else {
      // ... on a block, extract the contents and wrap them in the appropriate tag
      // TODO: decide if this is better or not, maybe combined with automatically applying the span formatting above if the span is not the one selected.
    }
  }
  else {
    // https://developer.mozilla.org/en-US/docs/Web/API/Range
    console.log("range:", selection.range);

    // first check if there are other similar spans inside to remove them, and then enclose all the block's contents in the appropriate span

    // ... check also if there are adjustment similar spans to merge with the new one

    // ... otherwise, just switch on/off the span
    if (enclosingElement.block) {
      console.log("... inside a block, we can just create the span:", enclosingElement.block);
      // const selectedText = selection.range.extractContents();
      // let wrapper = document.createElement("b");
      // wrapper.appendChild(selectedText);
      // selection.range.insertNode(wrapper);
    }
    else {
      console.log("... inside a span:", enclosingElement.span);
    }
  }
}

const h1Btn = document.getElementById("heading1");
const h2Btn = document.getElementById("heading2");
const h3Btn = document.getElementById("heading3");
const h4Btn = document.getElementById("heading4");
const h5Btn = document.getElementById("heading5");
const h6Btn = document.getElementById("heading6");
const textBtn = document.getElementById("text");
const boldBtn = document.getElementById("bold");
const italicBtn = document.getElementById("italic");
const underlineBtn = document.getElementById("underline");

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
  spanEvent("b");
});
italicBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  spanEvent("i");
});
underlineBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  spanEvent("u");
});



const jf = document.getElementById("justify-full");
jf.addEventListener("click", (event) => {
  event.stopPropagation();

  let selection = window.getSelection();
  console.log(selection);

  let tree = document.createTreeWalker(selection.anchorNode.parentElement);
  console.log(tree);
  // console.log(tree.parentNode());
  // console.log(tree.firstChild());
  // console.log(tree.lastChild());
  // console.log(tree.previousSibling());
  // console.log(tree.nextSibling());
  // console.log(tree.nextNode());
});

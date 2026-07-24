// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
const title = document.querySelector("title");
console.log(title.text + " script started...");

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var list = document.querySelector('ol');

var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    console.log("mutation:", mutation);
    if (mutation.type === 'childList') {
      var list_values = [].slice.call(list.children)
        .map(function (node) { return node.innerHTML; })
        .filter(function (s) {
          if (s === '<br>') {
            return false;
          }
          else {
            return true;
          }
        });
      console.log(list_values);
    }
  });
});

observer.observe(list, {
  attributes: true,
  childList: true,
  characterData: true
});

var textArea = document.getElementById("text-area");
var observer2 = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    console.log(mutation);
  });
});
observer2.observe(textArea, {
  attributes: true,
  childList: true,
  characterData: true
});

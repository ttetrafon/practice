// console.log("main script started...");

const elements = document.querySelectorAll('.btn');
// console.log("elements:", elements);

elements.forEach(element => {
  element.addEventListener("click", _ => {
    // console.log("clicked:", _.target);
    let command = element.dataset['element'];
    console.log("... command:", command);

    if (command === 'createLink' || command === 'insertImage') {
      let url = prompt("Enter URL:", "https://");
      document.execCommand(command, false, url);
    }
    else {
      document.execCommand(command, false, null);
    }
  });

});
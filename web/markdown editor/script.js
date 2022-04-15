console.log("main script started...");

const textEditor = document.querySelector('.text-editor');
const preview = document.querySelector('.preview');

textEditor.addEventListener("keyup", event => {
  console.log('key action:', event.keyCode);

  const { value } = event.target;
  console.log(value);

  // Parse the markdown text here and assign it to
  preview.innerHTML = value;
});

// https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
console.log("main script started...");

const form = document.forms.namedItem("fileinfo");

form.addEventListener("submit", (event) => {
  const output = document.querySelector("output");
  const formData = new FormData(form);

  formData.append("CustomField", "This is some extra data");

  const request = new XMLHttpRequest();
  request.open("POST", "stash.php", true);
  // If you pass in a reference to the form, the request method specified in the form will be used over the method specified in the open() call.
  request.onload = (progress) => {
    output.innerHTML =
      request.status === 200
        ? "Uploaded!"
        : `Error ${ request.status } occurred when trying to upload your file.<br />`;
  };

  request.send(formData);
  event.preventDefault();
},
  false
);

// You can also append a File or Blob directly to the FormData object, like this:
// data.append("myfile", myBlob, "filename.txt");
// When using the append() method it is possible to use the third optional parameter to pass a filename inside the Content-Disposition header that is sent to the server. When no filename is specified (or the parameter isn't supported), the name "blob" is used.

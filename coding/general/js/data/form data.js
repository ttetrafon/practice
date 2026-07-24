// FormData can be used to send requests over XMLHttpRequest, with the encoding type set to 'multipart/form-data'.
const formData = new FormData();

formData.append("username", "Groucho");
formData.append("account_number", 123456); // number 123456 is immediately converted to a string "123456"

// HTML file input, chosen by user
formData.append("user_file", fileInputElement.files[0]);

// JavaScript file-like object
const content = '<q id="a"><span id="b">hey!</span></q>'; // the body of the new file…
const blob = new Blob([content], { type: "text/xml"});

formData.append("web_master_file", blob);

const request = new XMLHttpRequest();
request.open("POST", "http://foo.com/submitform.php");
request.send(formData);

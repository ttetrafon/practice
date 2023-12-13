//   LOCAL STORAGE   //
// - capacity: 10mb
// - accessible: any window
// - expiration: never
// - storage location: on browser
localStorage.setItem('Name', 'ttetrafon (local)');
let locName = localStorage.getItem('Name');
// localStorage.removeItem('Name');
console.log("local storage: name = " + locName);


//   SESSION STORAGE   //
// - capacity: 5mb
// - accessible: same tab
// - expiration: on tab close
// - storage location: on browser
sessionStorage.setItem('Name', 'ttetrafon (session)');
let sesName = sessionStorage.getItem('Name');
// sessionStorage.removeItem('Name');
console.log("local storage: name = " + sesName);


//   COOKIES   //
// - capacity: 4kb
// - accessible: any window
// - expiration: as set
// - storage location: on browser and server
// - notes: stores the server's IP; is sent with every request
document.cookie = 'name=ttetrafon; expires=' + new Date(2021, 7, 1).toUTCString()
let cookie = document.cookie = 'login="value for login"; expires=' + new Date(9999, 7, 1).toUTCString()
// A domain parameter can be set in a cookie, so it will be send only to a more generalised path.
// For example, a cookie from the site 'foo.example.com' can have a domain of 'example.com' so that it will be send to all '*.example.com' paths.
console.log("cookies: cookie = " + cookie);


//   ---   EVENTS   ---   //
// Storage manipulation triggers events in the appropriate context.
// The event features the following properties:
// - key
// - newValue
// - oldValue
// - storageArea
// - url
window.addEventListener("storage", (event) => {
  console.log(event);
});

localStorage.setItem('Name', 'nakis (local)');

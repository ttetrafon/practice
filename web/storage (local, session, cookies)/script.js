// LOCAL STORAGE
// - capacity: 10mb
// - accessible: any window
// - expiration: never
// - storage location: on browser
// - notes: -
localStorage.setItem('Name', 'ttetrafon (local)');
localStorage.getItem('Name');
// localStorage.removeItem('Name');


// SESSION STORAGE
// - capacity: 5mb
// - accessible: same tab
// - expiration: on tab close
// - storage location: on browser
// - notes: -
sessionStorage.setItem('Name', 'ttetrafon (session)');
sessionStorage.getItem('Name');
// sessionStorage.removeItem('Name');


// COOKIES
// - capacity: 4kb
// - accessible: any window
// - expiration: as set
// - storage location: on browser and server
// - notes: stores the server's IP; is sent with every request
document.cookie = 'name=ttetrafon; expires=' + new Date(2021, 7, 1).toUTCString()
document.cookie = 'login="value for login"; expires=' + new Date(9999, 7, 1).toUTCString()

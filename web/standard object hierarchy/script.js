const title = document.querySelector("title");
console.log(title.text + " script started...");

// root object available at top level
// - accessible methods
//    - manipulation of windows: open(), close(), moveTo(), resizeTo(), focus(), blur(), ...
//    - JS timers: setTimeout(), setInterval(), ...
//    - UI prompts: alert(), prompt(), print(), ...
//    - vendor specifics: access to clipboard, bookmarks creation, home page manipulation, ...
// - globals are set in root
// - accessible structures: parent, top, opener, frames[], window, ...
//    - objects with specific 'ID' or 'name' will be registered in root also (except in Firefox)
// - browser APIs
//    - location: read URL, navigate
//    - history: methods to move in history, like with back and forward buttons (cannot examine these URLs, only navigate to them by providing numerical offsets)
//      - history.go(-2)
//    - screen: info about the screen and browser window (DPI, color depth, size, ...)
//    - navigator: browser version, plugins, and underlying operating system
//    - document: access to DOM

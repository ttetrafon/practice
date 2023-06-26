// To import like this the folder must be declared as a module - inside package.json.
import greetings from "./default exporter.js";
import otherNameGreeting from "./default exporter.js"; // the default export does not need to keep the same name, it can instead be given any name possible

greetings();
otherNameGreeting();


// Named imports instead must be declared with their names.
// They can also be imported individually, reducing the extra code bundled in a program.
import { greeting, bestMovieSeries } from './named exporter.js';
greeting();
console.log(bestMovieSeries);

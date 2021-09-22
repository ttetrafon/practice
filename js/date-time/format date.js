let date = new Date();
const offset = date.getTimezoneOffset();
date = new Date(date.getTime() - (offset*60*1000));
let formatted = date.toISOString().split('T')[0];
console.log(date.toISOString() + " -> " + formatted);
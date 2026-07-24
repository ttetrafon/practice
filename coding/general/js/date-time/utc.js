var d = new Date();
console.log(d);
d = d.toISOString();
// d = d.toUTCString();
console.log(d);
console.log(new Date(d));

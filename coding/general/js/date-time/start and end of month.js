var month = 0; // 0-based
var year = 2021;

var m = month + 1;
var from = new Date(year + "-" + (m < 10 ? "0" + m : m) + "-01");
console.log("from:\t", from);
var to = new Date(from.setMonth(month + 1));
to.setDate(to.getDate() - 1);
console.log("to:\t", to);
var start = from.getFullYear() + "-" + from.getMonth() + "-" + from.getDate();
var end = to.getFullYear() + "-" + to.getMonth() + "-" + to.getDate();
console.log(start, " - ", end);

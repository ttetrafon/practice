var date = "2020-10-19";
var time = '12:10';

var datetime = new Date(date + ' ' + time);
console.log(datetime);

console.log("---------------------------------------------------------------------------------------");

var now = new Date();

console.log(now.toISOString());
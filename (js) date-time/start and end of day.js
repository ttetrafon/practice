var processingDate = '2021-03-09 11:26:48';
var date = new Date(processingDate);
console.log(date);

var startOfDay = date.setHours(0, 0, 0, 0);
console.log("start of day: " + (new Date(startOfDay).toISOString().replace('T', ' ').slice(0, 19)));

var endOfDay = date.setHours(23, 59, 59, 999);
console.log("end of day: " + (new Date(endOfDay).toISOString().replace('T', ' ').slice(0, 19)));

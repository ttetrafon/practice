const now = new Date();
console.log(now.getTime(), now.toUTCString());

var startOfWeek = new Date(now.getTime() - (now.getDay() - 1) * 24 * 60 * 60 * 1000).setUTCHours(0, 0, 0, 0);
console.log(startOfWeek, new Date(startOfWeek).toUTCString());

var endOfWeek = startOfWeek + 7 * 24 * 60 * 60 * 1000;
console.log(endOfWeek, new Date(endOfWeek).toUTCString());

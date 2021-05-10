const now = new Date();
console.log(now);

var startOfWeek = new Date(now.getTime() - (now.getDay() - 1) * 24 * 60 * 60 * 1000).setUTCHours(0, 0, 0, 0);
console.log(new Date(startOfWeek));

var endOfWeek = startOfWeek + 7 * 24 * 60 * 60 * 1000;
console.log(new Date(endOfWeek));

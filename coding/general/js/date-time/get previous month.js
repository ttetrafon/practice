var d = new Date("15 Jan 2021");
console.log(d.toISOString());

d.setMonth(d.getMonth() - 1);
console.log(d.toISOString());

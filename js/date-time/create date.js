let date = "2020-10-19";
let time = '12:10';

let datetime = new Date(date + ' ' + time);
console.log(datetime);

console.log("---------------------------------------------------------------------------------------");

let now = new Date();

console.log(now.toISOString());

console.log("---------------------------------------------------------------------------------------");

let then = new Date(1727008096 * 1000);
console.log(then.toISOString());
console.log(then.toISOString().substring(11, 19));
console.log(`${(then.getHours() < 10 ? "0" + then.getHours() : then.getHours())}:${(then.getMinutes() < 10 ? "0" + then.getMinutes() : then.getMinutes())}:${then.getSeconds() < 10 ? "0" + then.getSeconds() : then.getSeconds()}`);

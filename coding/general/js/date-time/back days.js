let now = new Date();
console.log("now:", now);
let then = now.setDate(now.getDate() - 5);
console.log("then:", then);

function formatDateForSql(datetime) {
  console.log(`---> formatDateForSql(${datetime})`);
  var date = new Date(datetime);
  return new Date(date).toISOString().slice(0, 10);
}

console.log(
  formatDateForSql(then)
);

function changeDateBy(date, difference /* +1 or -1 */) {
    var inDate = new Date(date);
    inDate.setDate(inDate.getDate() + difference);
    console.log(inDate);
    return inDate.getFullYear() + '-' + (inDate.getMonth() + 1 < 10 ? '0' : '') + (inDate.getMonth() + 1) + '-' + (inDate.getDate() < 10 ? '0' : '') + inDate.getDate();
}

var initialDate = "2020-05-31";
console.log(changeDateBy(initialDate, 1));
// console.log(changeDateBy(initialDate, -1));

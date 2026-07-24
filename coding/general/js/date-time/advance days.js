function formatDateForSql(datetime) {
    var date = new Date(datetime);
    return new Date(date).toISOString().slice(0, 10);
}

let input = "Tue Jun 13 2023 00:00:00 GMT+0100 (British Summer Time)";
var processingDate = new Date(input);
console.log("processingDate: ", input, processingDate, processingDate.toISOString(), processingDate.toUTCString(), processingDate.toLocaleDateString(processingDate), formatDateForSql(processingDate));

var releaseDate = processingDate.setDate(processingDate.getDate() + 11);
console.log("releaseDate: ", formatDateForSql(releaseDate));

let today = new Date();
let tomorrow = today.setDate(today.getDate() + 1);
console.log(today, tomorrow, formatDateForSql(tomorrow), new Date(tomorrow));

function formatDateForSql(datetime) {
    var date = new Date(datetime);
    return new Date(date).toISOString().slice(0, 10);
}

var processingDate = new Date("Fri Mar 05 2021 11:04:42 GMT+0000 (Greenwich Mean Time)");
console.log("processingDate: ", processingDate);

var releaseDate = processingDate.setDate(processingDate.getDate() + 11);
console.log("releaseDate: ", formatDateForSql(releaseDate));

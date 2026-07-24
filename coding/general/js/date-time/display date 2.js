function formatDateFromDateTime(dateTime) {
    console.log('---> formatDateFromDateTime(' + dateTime + ')');
    var months = {
        'Jan': '01',
        'Feb': '02',
        'Mar': '03',
        'Apr': '04',
        'May': '05',
        'Jun': '06',
        'Jul': '07',
        'Aug': '08',
        'Sep': '09',
        'Oct': '10',
        'Nov': '11',
        'Dec': '12'
    };
    var date = new Date(dateTime).toUTCString().split(' ');
    console.log(date);
    return date[3] + '-' + months[date[2]] + '-' + date[1] + ' ' + date[4];
}

console.log(formatDateFromDateTime(1624233600000));
console.log(formatDateFromDateTime(1624838399000));

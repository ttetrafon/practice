var now = (new Date()).toString().split(' ');
console.log(now);

// long
// var res = now[0] + ', ' + now[2] + ' ' + now[1] + ' ' + now[3];
// console.log(res);

// american
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
var res = now[3] + '-' + months[now[1]] + '-' + now[2];
console.log(res);

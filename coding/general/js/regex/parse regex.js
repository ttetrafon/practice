var reg = (/^(18|20|25)$/).toString();
var values = reg.substring(reg.indexOf('(') + 1, reg.lastIndexOf(')')).split('|');
console.log(values);

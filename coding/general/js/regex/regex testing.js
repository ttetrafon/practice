var data = "150!151";
var regex = "^([0-9]\\/{0,1}){1,}$";
console.log(new RegExp(regex));

console.log(data.match(new RegExp(regex)));

var num = [1, 1.1, 1.11, 1.111, 1.1111, 1.11111, 1.111111, 1.1111111];
var maxDecimalPlaces = 5;

function NumberHasLessDecimalPlaces(number, maxDecimalPlaces) {
  var mult = Math.pow(10, maxDecimalPlaces);
  console.log('mult:', mult);
  var num = number * mult;
  console.log('num', num);
  num = Math.round(num * 10) / 10;
  console.log('num (round 1 decimal)', num);
  return (num % 1) === 0;
}

for (var i = 0; i < num.length; i++) {
  console.log('-------------------------------------------');
  console.log(NumberHasLessDecimalPlaces(num[i], maxDecimalPlaces));
}

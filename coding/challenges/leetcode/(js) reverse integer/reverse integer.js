/**
 * Reverse an 32-bit integer.
 * @param {} x
 */
var reverse = function(x) {
	var negative = false;
	if ((x < -(2**31)) || (x > 2**31 - 1)){
        return 0;
    }
	if (x < 0) {
		negative = true;
	}
	var res = (Math.abs(x)).toString().split('').reverse().join('');
	return (negative ? (-1) * res : res);
};

console.log('123 -> ' + reverse(123));
console.log('423981 -> ' + reverse(423981));
console.log('-500 -> ' + reverse(-500));

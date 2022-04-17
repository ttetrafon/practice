/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
	if (x === 0) {
		return true;
	}
	let numberString = (Math.abs(x)).toString();
	let len = numberString.length;
	for (let i = 0; i < Math.floor(len / 2); i++) {
		if (numberString[i] !== numberString[len - 1 - i]) {
			return false;
		}
	}
	return true;
};

const num = 156511;
console.log(isPalindrome(num));

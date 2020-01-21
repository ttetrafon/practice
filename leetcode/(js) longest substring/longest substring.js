/**
 * Given a string, find the length of the longest substring without repeating characters.
 *
Input: "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3
 *
Input: "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.
 *
Input: "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.
 *
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  if (s.length === 0) {
    return 1;
  }
  var sub = '';
  var max = 0;
  for (var i = 0; i < s.length; i++) {
    var char = s[i];
    var index = sub.indexOf(char);
    // console.log('char: ' + char + ' (position in substring: ' + index + ')');
    if (index < 0) {
      sub += char;
    }
    else {
      sub = sub.slice(index + 1);
      sub += char;
    }
    if (sub.length > max) {
      max = sub.length;
    }
    console.log(sub);
  }
  return max;
};

string = 'abv';
console.log(lengthOfLongestSubstring(string));

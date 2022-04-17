let allowedCharacters = [
  // lowercase alphabet
  ...[...Array(26).keys()].map(i => String.fromCharCode(i + 97)),
  // uppercase alphabet
  ...[...Array(26).keys()].map(i => String.fromCharCode(i + 65)),
  // special characters
  '.', '/', '*', '-', '+', ' ',
  // numbers
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9
]

// console.log(allowedCharacters);

function filterCharacters(str, allowed) {
  // console.log(`---> filterCharacters(${str}, ]${allowed}])`);
  let chars = str.split('');
  let filtered = chars.filter(c => { return allowed.includes(c); });
  // console.log(filtered);
  // console.log(filtered.join(''));
  return filtered.join('');
}

let str = "This; is a_ string with both+ allowed- and not *allowed* characters!";
let res = filterCharacters(str, allowedCharacters);
console.log(`${str} [len: ${str.length}] -> ${res} [len: ${res.length}]`);

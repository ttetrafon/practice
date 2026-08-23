// 6-digit number
const codeArr = new Uint32Array(1);
crypto.getRandomValues(codeArr);
// const code = (codeArr[0] % 1_000_000).toString().padStart(6, '0');
const code = 100_000 + (codeArr[0] % 900_000);
console.log(code);

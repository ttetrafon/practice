const numbers = [1, 2, 3, 4, 5, 5, 5, 6, 7, 7, 8, 9, 9, 0, 0, 0, 0];
console.log("numbers:", numbers);

const uniqueNumbers = new Set(numbers);
console.log("uniqueNumbers:", uniqueNumbers);

if (uniqueNumbers.has(5)) {
  uniqueNumbers.delete(5);
}
console.log("uniqueNumbers:", uniqueNumbers);
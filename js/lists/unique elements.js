const getUniqueElements = (arr) => [... new Set(arr)];

let list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
console.log(getUniqueElements(list));
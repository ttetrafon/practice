const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

let list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let out = shuffle(list);
console.log(list, " => ", out);

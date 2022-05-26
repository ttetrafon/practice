let str = 'The quick brown fox. Is brown even a colour?';
console.log(str.replace(/brown/g, 'yellow'));

let numbers = 'If I had 1 basket with 8 eggs and a fox stole 5 of them, do I still have 1 basket of eggs?';
console.log(
  numbers.replace(/\d/g, number => {
    return (parseInt(number, 10) % 2 == 1 ? '@' : number);
  })
);

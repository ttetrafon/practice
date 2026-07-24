list1 = [1, 2, 3];
list2 = [4, 5, 6];

list1.push(...list2);
console.log(list1);

list1.push(...[]);
console.log(list1);

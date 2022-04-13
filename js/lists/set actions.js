let arr1 = [ 1, 3, 4, 5 ];
let arr2 = [ 1, 2, 5, 6, 7 ];
console.log("arrays: ", arr1, arr2);

let intersection = arr1.filter(el => arr2.includes(el));
console.log("intersection:", intersection);

let difference = arr1.filter(el => !arr2.includes(el));
console.log("difference:", difference);

let symmetricalDifference = arr1.filter(x => !arr2.includes(x)).concat(arr2.filter(x => !arr1.includes(x)));
console.log("symmetrical difference:", symmetricalDifference.sort());

let union = [... arr1, ...arr2];
console.log("union:", union);

let cleanUnion = [... new Set([... arr1, ...arr2])];
console.log("clean union:", cleanUnion);

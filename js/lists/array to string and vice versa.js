//////////////////
///   DIGITS   ///
//////////////////
var arr = [1,2,3];

// Concatenate
var num = parseInt(arr.join(""));
console.log("concatenated:", num);

// Split
console.log(
    num.toString().split("").map(x => parseInt(x))
);

////////////////////////////
///   INDEX - INTEGERS   ///
////////////////////////////
var arr2 = [55, 4, 1624]
console.log("array2:", arr2);

// Create the index
var index2 = arr2.map(x => x.toString().length);
console.log("index2:", index2);

// Concatenate
var num2 = parseInt(index2.join("") + arr2.join(""));
console.log("num2:", num2);

// One liner
console.log(
    "num2:",
    parseInt(arr2.map(x => x.toString().length).join("") + arr2.join("")),
    " (one-liner)"
);

// Split
var index2In = num2.toString().substring(0, 3).split("").map(x => parseInt(x));
console.log("index2 (in):", index2In);

var num2In = num2.toString().substring(3, num2.toString().length);
console.log("num2 (in)", num2In);

var arr2In = [];
let k = 0;
for (let i = 0; i < index2In.length; i++) {
    console.log(" - ", index2In[i], ", ", k);
    arr2In.push(num2In.toString().substring(k, k + index2In[i]));
    k = k + index2In[i];
}
console.log("arr2 (in):", arr2In);


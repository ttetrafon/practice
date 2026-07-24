// console.log("any".match(new RegExp("^any$")));
// console.log("any".match(/^any$/))
// console.log("0.01".match(/^[0-9]+\.[0-9]{0,2}$/));
// console.log("0.01".match(new RegExp("^[0-9]+\.[0-9]{0,2}$")));

var maxDecimalPlacess = 0;
var regex = "^[0-9]+" + (maxDecimalPlacess > 0 ? "\.[0-9]{0," + maxDecimalPlacess + "}": "") + "$";

console.log(regex);

var input = ["1", "0.1", "0.01", "0.001", "0.0001", "0.00001", "0.0000001", "0.00000001"];

for (var i = 0; i < input.length; i++) {
    console.log("(" + i + ") " + input[i] + ": ", input[i].match(new RegExp(regex)) !== null);
}

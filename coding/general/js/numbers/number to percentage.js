var numbers = [0.2, 0.20000001, 0.1999999, 0.23, 0.22999999999];

function doubleToPercentage(num) {
    console.log("---> doubleToPercentage(" + num + ")");
    var str = num.toString();
    var decimals = str.substring(str.indexOf('.') + 1);
    console.log('decimals: ', decimals, decimals.length);
    if (decimals.length <= 2) {
        return (num * 100).toString();
    }
    else {
        var num100 = num * 100;
        console.log("num100: ", num100);
        str = num100.toString();
        decimals = str.substring(str.indexOf('.') + 1);
        console.log('decimals: ', decimals, decimals.length);
        if (decimals[0] === '0') {
            return str.substring(0, str.indexOf('.'));
        }
        else if (decimals[0] === '9') {
            return (parseInt(str.substring(0, str.indexOf('.'))) + 1).toString();
        }
        else {
            return "";
        }
    }
}

var res = numbers.map(x => doubleToPercentage(x));
console.log(numbers);
console.log(res);

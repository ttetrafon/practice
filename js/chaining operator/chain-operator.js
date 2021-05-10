// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining

var obj = {
    one: '1',
    two: {
        three: '3',
        five: '5'
    }
}

console.log(obj.four?.three);
// This is expected to return undefined instead of throwing an error.
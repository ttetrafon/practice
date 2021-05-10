testObj = {
    a: 'a',
    b: 'b',
    c: 'c'
};
testProps = ['a', 'b'];

function removeUnwantedProperties(obj, props) {
    if ((typeof obj != 'object') || (obj === null) || (obj instanceof Array)) {
        if ((obj === null) || (obj === undefined) || (obj === '')) {
            return 'NaN'
        } else {
            return obj;
        }
    }
    if (!(props instanceof Array)) {
        props = [props];
    }
    var res = {};
    var properties = Object.keys(obj);
    properties.forEach((prop) => {
        if (!props.includes(prop)) {
            if (typeof obj[prop] === 'object') {
                var subObj = this.removeUnwantedProperties(obj[prop]);
                res[prop] = subObj;
            }
            else {
                res[prop] = obj[prop];
            }
        }
    });
    return res;
}

testResult = removeUnwantedProperties(testObj, testProps);
console.log(testResult);

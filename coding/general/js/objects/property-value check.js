var obj = {
  a: '',
  b: '2',
  c: 3,
  d: {
    d1: undefined,
    d2: ['22'],
    d3: {
      k: 'a',
      l: null
    }
  }
}

function checkPropertiesForEmpty(obj) {
  if ((typeof obj != 'object') || (obj === null) || (obj instanceof Array)) {
    if ((obj === null) || (obj === undefined) || (obj === '')) {
      return 'NaN'
    } else {
      return obj;
    }
  }
  var res = {};
  var properties = Object.keys(obj);
  properties.forEach((prop) => {
    console.log(prop + ': ' + (typeof obj[prop]))
    if (typeof obj[prop] === 'object') {
      var subObj = checkPropertiesForEmpty(obj[prop]);
      res[prop] = subObj;
    }
    else {
      var value = obj[prop];
      if ((value === null) || (value === undefined) || (value === '')) {
        value = 'NaN';
      }
      res[prop] = value;
    }
  });
  return res;
}
var result = checkPropertiesForEmpty(obj);
console.log(result);

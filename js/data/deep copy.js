// Simplistic deep copy of data structures
function deepCopy(obj) {
  if (!obj || typeof(obj) != 'object') {
    return obj;
  }

  let res;
  if (obj instanceof Array) {
    res = [];
    obj.forEach(element => {
      res.push(deepCopy(element));
    });

  }
  else {
    res = {};
    Object.keys(obj).forEach(key => {
      res[key] = deepCopy(obj[key]);
    });
  }
  return res;
}

objects = [
  5,
  "I am a string...",
  [1, 2, 3],
  { "a": 5, "b": 6 },
  { "a": 5, "b": { "c": 15, "d": [1, 4, 8] } }
];
objects.forEach(
  (item) => {
    console.log(item, "->", deepCopy(item));
  }
);

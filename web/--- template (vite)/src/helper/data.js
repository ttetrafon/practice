export function allCombinations(arr) {
  if (arr.length == 1) {
    return arr[0];
  } else {
    var result = [];
    var allCasesOfRest = allCombinations(arr.slice(1)); // recur with the rest of array
    for (var i = 0; i < allCasesOfRest.length; i++) {
      for (var j = 0; j < arr[0].length; j++) {
        result.push(arr[0][j] + "," + allCasesOfRest[i]);
      }
    }
    return result;
  }
}

export function deepCopy(obj) {
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

export function checkStringForExistence(str) {
  return !(str == undefined || str == null || str == "");
}
export function checkStringForNonExistence(str) {
  return str == undefined || str == null || str == "";
}

var values = [
  "Swipe",
  "IntegratedCircuitCardFallbackToSwipe",
  "IntegratedCircuitCard",
  "integratedCircuitCard",
  "Keyed",
  "ContactlessEMV",
  "ABCTestABC"
];

function SplitCamelCase(str) {
  let parts = str.match(/([A-Z]?[^A-Z]*)/g).slice(0,-1);
  console.log(parts);
  let ret = parts[0];
  for (var i = 1; i < parts.length; i++) {
    let part = parts[i];
    ret += (part.length > 1 ? " " : "") + part;
  }
  return ret;
}

function SplitCamelCaseAlt(str) {
  console.log("---> SplitCamelCaseAlt(" + str + ")");
  let strLow = str.toLowerCase();
  let ret = str[0];
  for (var i = 1; i < str.length; i++) {
    let test1 = (str[i] !== strLow[i]) && (str[i-1] === strLow[i-1]);
    let test2 = ((i + 1) < str.length) && (str[i] !== strLow[i]) && (str[i+1] === strLow[i+1]);
    // console.log(str[i], strLow[i], test1, test2);
    ret += (test1 || test2 ? " " : "" );
    ret += str[i];
  }
  return ret.charAt(0).toUpperCase() + ret.slice(1);
}

for (var i = 0; i < values.length; i++) {
  console.log("-", values[i], "->", SplitCamelCaseAlt(values[i]));
}

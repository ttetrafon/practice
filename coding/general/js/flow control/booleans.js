// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean

const items = [ 0, 1, "", "qwerty", "true", "false", [], {}, null, undefined, { "items": 15, "type": "" } ];

items.forEach(item => {
  console.log(`'${item}' [${typeof item}]: Boolean=${Boolean(item)}; !!=${!!item}`);
});

console.log(
  items.filter(item => { return Boolean(item); })
);

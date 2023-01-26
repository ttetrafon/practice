// initialise a map
const currency_map = new Map([
  ["Great Britain", "GBP"]
]);

// add a mapping
currency_map.set("Greece", "EUR");

// keys can be whatever...
const usa = {
  name: "USA"
};
currency_map.set(usa, "USD");

console.log(currency_map);
console.log(currency_map.get(usa));

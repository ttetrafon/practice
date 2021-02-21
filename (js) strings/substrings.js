// var terminal = "Gym 1 (AB123456)";
// var id = terminal.substring(terminal.lastIndexOf('(') + 1, terminal.lastIndexOf(')'));
// console.log(id);

var error = "Duplicate entry 'GBP-test' for key 'IX_CURRENCY_CODE_ACCOUNT'";
var closingQuote = error.lastIndexOf("'");
var openingQuote = error.lastIndexOf("'", closingQuote - 1);
var parts = error.substring(openingQuote + 1, closingQuote).split("_");
console.log(
    parts[parts.length - 1]
);

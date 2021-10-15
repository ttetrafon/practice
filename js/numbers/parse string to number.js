var str = [
    "a",
    "1",
    "a10",
    "5e2",
    "156px",
    "3.25"
];

function parseString(str) {
    let parsedFloat = parseFloat(str);
    let parsedInt = parseInt(str);
    let numbered = Number(str);
    return "'" + str + "':  (parseInt) = " + parsedInt + ";  (parseFloat) = " + parsedFloat + ";  (Number) = " + numbered;
}

for (i = 0; i < str.length; i++) {
    console.log(parseString(str[i]));
}

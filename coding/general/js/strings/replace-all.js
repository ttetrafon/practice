let str = "This is the one.\r\n This is what is important!";

let updated = str.replaceAll("\r\n", "\n");

console.log(JSON.stringify(str), "\n->\n", JSON.stringify(updated));

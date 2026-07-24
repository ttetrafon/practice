const generateRandomColour = () =>  `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;

console.log("1: " + generateRandomColour());
console.log("2: " + generateRandomColour());
console.log("3: " + generateRandomColour());

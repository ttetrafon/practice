// Labeled flow statements can be controlled with 'break' and 'continue'.

let lstNoLabel = [];
let lstLabel = [];

for (var i = 0; i < 5; i++) {
  for (var j = 0; j < 5; j++) {
    if (j === 1) {
      continue;
    }
    lstLabel.push([i, j]);
  }
}

loop1:
for (var i = 0; i < 5; i++) {
  loop2:
  for (var j = 0; j < 5; j++) {
    if (j === 1) {
      continue loop1;
    }
    lstNoLabel.push([i, j]);
  }
}

console.log("without label:", lstNoLabel);
console.log("with label:", lstLabel);
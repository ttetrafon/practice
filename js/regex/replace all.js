let str = "This is **some** test that needs **to be bold**";
let bold = /\*\*(.*?)\*\*/g;

console.log(
  str, "->", str.replaceAll(bold, '<b>$1</b>')
);

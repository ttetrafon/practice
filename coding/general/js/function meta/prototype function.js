Array.prototype.count = function () {
  this.map((element, index, array) => {
    let count = 0;
    for(let i=0; i < array.length; i++) {
      count++;
      console.log("... counting " + count);
    }
    return count;
  })
  return this;
}

function isPangram(string){
  let regex = /[^a-z]*/ig;
  let letters = string.toLowerCase().replace(regex, "").split("");
  return letters.count();
}

var str = "The quick brown fox jumps over the lazy dog.";
console.log("count: ", isPangram(str));

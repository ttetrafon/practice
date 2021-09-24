function isPangram(str) {
  const lowercase = str.toLowerCase();
  const matches = lowercase.match(/[a-z]/ig);
  const unique = new Set(matches);

  return unique.size === 26;
}

const str = "The quick brown fox jumps over the lazy dog.";
console.log("`" + str + "` is a pan-gram: " + isPangram(str));

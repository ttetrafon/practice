loop1: for (let i = 0; i < 4; i++) {
  loop2: for (let j = 0; j < 4; j++) {
    console.log("before...");
    if (i == 1) {
      // continue;
      continue loop1;
    }
    console.log(`i = ${i}, j = ${j}`);
  }
}

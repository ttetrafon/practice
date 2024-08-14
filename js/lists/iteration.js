let numbers = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512];

for (const n of numbers) {
  console.log(`for-of: ${n}`);
}

for (const [i, n] of numbers.entries()) {
  console.log(`for-of: key=${i}, value=${n}`);
}

numbers.forEach(n => {
  console.log(`forEach: ${n}`);
});

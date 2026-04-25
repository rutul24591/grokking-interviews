function popcount(value) {
  let count = 0;
  let remaining = value;
  while (remaining) {
    remaining &= remaining - 1;
    count += 1;
  }
  return count;
}

console.log("0b111010 ->", popcount(0b111010));
console.log("0b10000000 ->", popcount(0b10000000));

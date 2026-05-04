function hammingWeight(n) {
  n = n >>> 0;
  let count = 0;
  while (n !== 0) {
    n = (n & (n - 1)) >>> 0;
    count += 1;
  }
  return count;
}

if (require.main === module) {
  console.log(hammingWeight(0b00000000000000000000000000001011));
}

module.exports = { hammingWeight };

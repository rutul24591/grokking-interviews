function hammingWeightScan(n) {
  n = n >>> 0;
  let count = 0;
  for (let i = 0; i < 32; i += 1) {
    count += (n >>> i) & 1;
  }
  return count;
}

if (require.main === module) {
  console.log(hammingWeightScan(0b00000000000000000000000000001011));
}

module.exports = { hammingWeightScan };

function reverseBitsScan(n) {
  n = n >>> 0;
  let result = 0;
  for (let i = 0; i < 32; i += 1) {
    result = (result << 1) | (n & 1);
    n >>>= 1;
  }
  return result >>> 0;
}

if (require.main === module) {
  console.log(reverseBitsScan(0b00000010100101000001111010011100));
}

module.exports = { reverseBitsScan };

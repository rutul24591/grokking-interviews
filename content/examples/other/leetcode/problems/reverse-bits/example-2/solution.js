function reverseBits(n) {
  n = n >>> 0;
  n = ((n >>> 1) & 0x55555555) | ((n & 0x55555555) << 1);
  n = ((n >>> 2) & 0x33333333) | ((n & 0x33333333) << 2);
  n = ((n >>> 4) & 0x0f0f0f0f) | ((n & 0x0f0f0f0f) << 4);
  n = ((n >>> 8) & 0x00ff00ff) | ((n & 0x00ff00ff) << 8);
  n = (n >>> 16) | (n << 16);
  return n >>> 0;
}

if (require.main === module) {
  console.log(reverseBits(0b00000010100101000001111010011100));
}

module.exports = { reverseBits };

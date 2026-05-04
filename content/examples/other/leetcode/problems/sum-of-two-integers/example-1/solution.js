function getSumBitByBit(a, b) {
  a |= 0;
  b |= 0;
  let result = 0;
  let carry = 0;
  for (let i = 0; i < 32; i += 1) {
    const abit = (a >>> i) & 1;
    const bbit = (b >>> i) & 1;
    const sum = abit ^ bbit ^ carry;
    carry = (abit & bbit) | (abit & carry) | (bbit & carry);
    result |= sum << i;
  }
  return result | 0;
}

if (require.main === module) {
  console.log(getSumBitByBit(1, 2));
  console.log(getSumBitByBit(-4, 7));
}

module.exports = { getSumBitByBit };

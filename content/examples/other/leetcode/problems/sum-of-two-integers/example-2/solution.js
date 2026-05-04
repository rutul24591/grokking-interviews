function getSum(a, b) {
  a |= 0;
  b |= 0;
  while (b !== 0) {
    const carry = (a & b) << 1;
    a = (a ^ b) | 0;
    b = carry | 0;
  }
  return a | 0;
}

if (require.main === module) {
  console.log(getSum(1, 2));
  console.log(getSum(-4, 7));
}

module.exports = { getSum };

function singleNumber(nums) {
  let x = 0;
  for (const n of nums) x ^= n;
  return x;
}

module.exports = { singleNumber };

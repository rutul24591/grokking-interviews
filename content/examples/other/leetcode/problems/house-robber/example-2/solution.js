function rob(nums) {
  let prev2 = 0;
  let prev1 = 0;
  for (const x of nums) {
    const cur = Math.max(prev1, prev2 + x);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}

if (require.main === module) {
  console.log(rob([1, 2, 3, 1]));
}

module.exports = { rob };

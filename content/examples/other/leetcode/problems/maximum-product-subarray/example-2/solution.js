function maxProduct(nums) {
  if (nums.length === 0) return 0;
  let currentMax = nums[0];
  let currentMin = nums[0];
  let best = nums[0];

  for (let i = 1; i < nums.length; i += 1) {
    const x = nums[i];
    const a = x;
    const b = x * currentMax;
    const c = x * currentMin;
    const nextMax = Math.max(a, b, c);
    const nextMin = Math.min(a, b, c);
    currentMax = nextMax;
    currentMin = nextMin;
    best = Math.max(best, currentMax);
  }
  return best;
}

if (require.main === module) {
  console.log(maxProduct([2, 3, -2, 4]));
}

module.exports = { maxProduct };

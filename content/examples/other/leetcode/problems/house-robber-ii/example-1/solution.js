function robLinearDP(nums, start, end) {
  let prev2 = 0;
  let prev1 = 0;
  for (let i = start; i <= end; i += 1) {
    const cur = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}

function robHouseRobberII(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  return Math.max(robLinearDP(nums, 0, nums.length - 2), robLinearDP(nums, 1, nums.length - 1));
}

if (require.main === module) {
  console.log(robHouseRobberII([2, 3, 2]));
  console.log(robHouseRobberII([1, 2, 3, 1]));
}

module.exports = { robHouseRobberII };

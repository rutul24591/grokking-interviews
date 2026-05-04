function robLinear(nums, start, end) {
  let take = 0;
  let skip = 0;
  for (let i = start; i <= end; i += 1) {
    const nextTake = skip + nums[i];
    const nextSkip = Math.max(skip, take);
    take = nextTake;
    skip = nextSkip;
  }
  return Math.max(take, skip);
}

function rob(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return nums[0];
  return Math.max(robLinear(nums, 0, nums.length - 2), robLinear(nums, 1, nums.length - 1));
}

if (require.main === module) {
  console.log(rob([2, 3, 2]));
  console.log(rob([1, 2, 3, 1]));
}

module.exports = { rob };

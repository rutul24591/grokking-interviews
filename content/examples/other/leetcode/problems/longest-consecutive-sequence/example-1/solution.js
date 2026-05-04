function longestConsecutiveSort(nums) {
  if (nums.length === 0) return 0;
  nums.sort((a, b) => a - b);
  let best = 1;
  let cur = 1;
  for (let i = 1; i < nums.length; i += 1) {
    if (nums[i] === nums[i - 1]) continue;
    if (nums[i] === nums[i - 1] + 1) cur += 1;
    else cur = 1;
    best = Math.max(best, cur);
  }
  return best;
}

if (require.main === module) {
  console.log(longestConsecutiveSort([100, 4, 200, 1, 3, 2]));
}

module.exports = { longestConsecutiveSort };

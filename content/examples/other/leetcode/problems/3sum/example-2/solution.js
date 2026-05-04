function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < nums.length; i += 1) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        out.push([nums[i], nums[left], nums[right]]);
        left += 1;
        right -= 1;
        while (left < right && nums[left] === nums[left - 1]) left += 1;
        while (left < right && nums[right] === nums[right + 1]) right -= 1;
      } else if (sum < 0) {
        left += 1;
      } else {
        right -= 1;
      }
    }
  }
  return out;
}

if (require.main === module) {
  console.log(threeSum([-1, 0, 1, 2, -1, -4]));
}

module.exports = { threeSum };

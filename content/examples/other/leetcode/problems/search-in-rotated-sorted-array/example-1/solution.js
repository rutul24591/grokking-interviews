function searchLinear(nums, target) {
  for (let i = 0; i < nums.length; i += 1) {
    if (nums[i] === target) return i;
  }
  return -1;
}

if (require.main === module) {
  console.log(searchLinear([4, 5, 6, 7, 0, 1, 2], 0));
}

module.exports = { searchLinear };

function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return null;
}

if (require.main === module) {
  console.log(twoSum([2, 7, 11, 15], 9));
}

module.exports = { twoSum };

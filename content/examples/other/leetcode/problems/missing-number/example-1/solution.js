function missingNumberSort(nums) {
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i += 1) {
    if (nums[i] !== i) return i;
  }
  return nums.length;
}

if (require.main === module) {
  console.log(missingNumberSort([3, 0, 1]));
}

module.exports = { missingNumberSort };

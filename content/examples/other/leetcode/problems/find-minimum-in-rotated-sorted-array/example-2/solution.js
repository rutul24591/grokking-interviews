function findMin(nums) {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    if (nums[left] < nums[right]) return nums[left];
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] >= nums[left]) left = mid + 1;
    else right = mid;
  }
  return nums[left];
}

if (require.main === module) {
  console.log(findMin([3, 4, 5, 1, 2]));
}

module.exports = { findMin };

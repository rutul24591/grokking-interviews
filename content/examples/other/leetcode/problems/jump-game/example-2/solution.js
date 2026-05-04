function canJumpGreedy(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i += 1) {
    if (i > farthest) return false;
    farthest = Math.max(farthest, i + nums[i]);
  }
  return true;
}

if (require.main === module) {
  console.log(canJumpGreedy([2, 3, 1, 1, 4]));
  console.log(canJumpGreedy([3, 2, 1, 0, 4]));
}

module.exports = { canJumpGreedy };

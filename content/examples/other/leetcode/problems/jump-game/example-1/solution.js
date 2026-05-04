function canJumpDP(nums) {
  const good = new Array(nums.length).fill(false);
  good[nums.length - 1] = true;
  for (let i = nums.length - 2; i >= 0; i -= 1) {
    const farthest = Math.min(nums.length - 1, i + nums[i]);
    for (let j = i + 1; j <= farthest; j += 1) {
      if (good[j]) {
        good[i] = true;
        break;
      }
    }
  }
  return good[0];
}

if (require.main === module) {
  console.log(canJumpDP([2, 3, 1, 1, 4]));
  console.log(canJumpDP([3, 2, 1, 0, 4]));
}

module.exports = { canJumpDP };

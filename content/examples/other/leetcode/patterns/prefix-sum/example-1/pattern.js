function buildPrefix(nums) {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i += 1) prefix[i + 1] = prefix[i] + nums[i];
  return prefix;
}

function rangeSum(prefix, left, rightInclusive) {
  return prefix[rightInclusive + 1] - prefix[left];
}

module.exports = { buildPrefix, rangeSum };

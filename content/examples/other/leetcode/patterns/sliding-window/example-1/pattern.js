function maxSumSubarrayK(nums, k) {
  if (k <= 0) throw new Error("k must be positive");
  if (nums.length < k) return null;

  let windowSum = 0;
  for (let i = 0; i < k; i += 1) windowSum += nums[i];
  let best = windowSum;

  for (let right = k; right < nums.length; right += 1) {
    windowSum += nums[right] - nums[right - k];
    best = Math.max(best, windowSum);
  }

  return best;
}

module.exports = { maxSumSubarrayK };

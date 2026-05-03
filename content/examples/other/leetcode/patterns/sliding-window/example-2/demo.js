function minSubarrayLen(target, nums) {
  let left = 0;
  let sum = 0;
  let best = Infinity;
  for (let right = 0; right < nums.length; right += 1) {
    sum += nums[right];
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= nums[left++];
    }
  }
  return Number.isFinite(best) ? best : 0;
}

console.log(minSubarrayLen(7, [2, 1, 5, 2, 3, 2]));
console.log(minSubarrayLen(100, [1, 2, 3]));

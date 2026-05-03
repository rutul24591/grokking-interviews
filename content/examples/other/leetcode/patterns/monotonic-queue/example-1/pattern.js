function maxSlidingWindow(nums, k) {
  if (k <= 0) throw new Error("k must be positive");
  const deque = []; // indices, values decreasing
  const out = [];
  for (let i = 0; i < nums.length; i += 1) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && nums[i] >= nums[deque[deque.length - 1]]) deque.pop();
    deque.push(i);
    if (i >= k - 1) out.push(nums[deque[0]]);
  }
  return out;
}

module.exports = { maxSlidingWindow };

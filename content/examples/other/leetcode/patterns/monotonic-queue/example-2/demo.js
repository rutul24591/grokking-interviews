function minSlidingWindow(nums, k) {
  const deque = [];
  const out = [];
  for (let i = 0; i < nums.length; i += 1) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && nums[i] <= nums[deque[deque.length - 1]]) deque.pop();
    deque.push(i);
    if (i >= k - 1) out.push(nums[deque[0]]);
  }
  return out;
}

console.log(minSlidingWindow([1,3,-1,-3,5,3,6,7], 3));

function nextGreaterElements(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // indices, nums decreasing
  for (let i = 0; i < nums.length; i += 1) {
    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {
      const idx = stack.pop();
      result[idx] = nums[i];
    }
    stack.push(i);
  }
  return result;
}

module.exports = { nextGreaterElements };

function largestRectangleArea(heights) {
  const stack = [];
  let best = 0;
  for (let i = 0; i <= heights.length; i += 1) {
    const current = i === heights.length ? 0 : heights[i];
    while (stack.length && current < heights[stack[stack.length - 1]]) {
      const h = heights[stack.pop()];
      const left = stack.length ? stack[stack.length - 1] + 1 : 0;
      best = Math.max(best, h * (i - left));
    }
    stack.push(i);
  }
  return best;
}

console.log(largestRectangleArea([2,1,5,6,2,3]));

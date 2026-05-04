function maxSubArray(nums) {
  let best = nums[0];
  let cur = nums[0];
  for (let i=1;i<nums.length;i+=1) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}

if (require.main===module) {
  console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));
}

module.exports = { maxSubArray };

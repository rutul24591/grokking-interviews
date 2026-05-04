function maxSubArray(nums) {
  let best = -Infinity;
  for (let i=0;i<nums.length;i+=1) {
    let sum = 0;
    for (let j=i;j<nums.length;j+=1) {
      sum += nums[j];
      best = Math.max(best, sum);
    }
  }
  return best;
}

if (require.main===module) {
  console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));
}

module.exports = { maxSubArray };

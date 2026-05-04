function productExceptSelf(nums) {
  const n = nums.length;
  const out = new Array(n);
  let prefix = 1;
  for (let i=0;i<n;i+=1) {
    out[i] = prefix;
    prefix *= nums[i];
  }
  let suffix = 1;
  for (let i=n-1;i>=0;i-=1) {
    out[i] *= suffix;
    suffix *= nums[i];
  }
  return out;
}

if (require.main===module) {
  console.log(productExceptSelf([1,2,3,4]));
}

module.exports = { productExceptSelf };

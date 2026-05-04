function productExceptSelf(nums) {
  const out = [];
  for (let i=0;i<nums.length;i+=1) {
    let prod = 1;
    for (let j=0;j<nums.length;j+=1) {
      if (i===j) continue;
      prod *= nums[j];
    }
    out.push(prod);
  }
  return out;
}

if (require.main===module) {
  console.log(productExceptSelf([1,2,3,4]));
}

module.exports = { productExceptSelf };

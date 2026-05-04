function containsDuplicate(nums) {
  nums = nums.slice().sort((a,b)=>a-b);
  for (let i=1;i<nums.length;i+=1) {
    if (nums[i]===nums[i-1]) return true;
  }
  return false;
}

if (require.main===module) {
  console.log(containsDuplicate([1,2,3,1]));
}

module.exports = { containsDuplicate };

function missingNumber(nums) {
  let x = 0;
  for (let i = 0; i <= nums.length; i += 1) x ^= i;
  for (const v of nums) x ^= v;
  return x;
}

if (require.main === module) {
  console.log(missingNumber([3, 0, 1]));
}

module.exports = { missingNumber };

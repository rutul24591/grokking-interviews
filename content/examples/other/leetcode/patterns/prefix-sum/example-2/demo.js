function subarraySum(nums, k) {
  const seen = new Map([[0, 1]]);
  let sum = 0;
  let count = 0;
  for (const num of nums) {
    sum += num;
    count += seen.get(sum - k) ?? 0;
    seen.set(sum, (seen.get(sum) ?? 0) + 1);
  }
  return count;
}

console.log(subarraySum([1,1,1], 2));
console.log(subarraySum([3,4,7,2,-3,1,4,2], 7));

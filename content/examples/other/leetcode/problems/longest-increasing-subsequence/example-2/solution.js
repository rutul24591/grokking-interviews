function lengthOfLIS(nums) {
  const tails = [];
  for (const x of nums) {
    let left = 0;
    let right = tails.length;
    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      if (tails[mid] < x) left = mid + 1;
      else right = mid;
    }
    tails[left] = x;
  }
  return tails.length;
}

if (require.main === module) {
  console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]));
}

module.exports = { lengthOfLIS };

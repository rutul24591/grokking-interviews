function topKFrequentBucket(nums, k) {
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);

  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, count] of freq.entries()) buckets[count].push(num);

  const out = [];
  for (let c = buckets.length - 1; c >= 0 && out.length < k; c -= 1) {
    for (const num of buckets[c]) {
      out.push(num);
      if (out.length === k) break;
    }
  }
  return out;
}

if (require.main === module) {
  console.log(topKFrequentBucket([1, 1, 1, 2, 2, 3], 2));
}

module.exports = { topKFrequentBucket };

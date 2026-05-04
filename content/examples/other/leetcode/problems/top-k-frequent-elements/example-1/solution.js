function topKFrequentSort(nums, k) {
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num]) => num);
}

if (require.main === module) {
  console.log(topKFrequentSort([1, 1, 1, 2, 2, 3], 2));
}

module.exports = { topKFrequentSort };

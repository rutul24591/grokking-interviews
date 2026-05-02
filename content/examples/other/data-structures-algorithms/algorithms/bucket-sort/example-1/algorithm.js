function bucketSort(values, bucketCount = 5) {
  const arr = [...values];
  if (arr.length === 0) return [];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min || 1;
  const buckets = Array.from({ length: bucketCount }, () => []);
  for (const value of arr) {
    const index = Math.min(
      bucketCount - 1,
      Math.floor(((value - min) / range) * bucketCount),
    );
    buckets[index].push(value);
  }
  const out = [];
  for (const bucket of buckets) {
    // local insertion sort per bucket
    for (let i = 1; i < bucket.length; i += 1) {
      const key = bucket[i];
      let j = i - 1;
      while (j >= 0 && bucket[j] > key) {
        bucket[j + 1] = bucket[j];
        j -= 1;
      }
      bucket[j + 1] = key;
    }
    out.push(...bucket);
  }
  return out;
}

module.exports = { bucketSort };

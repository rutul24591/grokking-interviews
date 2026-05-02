function radixSort(values) {
  let arr = [...values];
  const max = Math.max(...arr, 0);
  let exp = 1;
  while (Math.floor(max / exp) > 0) {
    const buckets = Array.from({ length: 10 }, () => []);
    for (const value of arr) {
      const digit = Math.floor(value / exp) % 10;
      buckets[digit].push(value);
    }
    arr = buckets.flat();
    exp *= 10;
  }
  return arr;
}

module.exports = { radixSort };

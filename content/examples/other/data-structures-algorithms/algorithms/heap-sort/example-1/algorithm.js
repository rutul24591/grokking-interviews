function heapSort(values, compare) {
  const arr = [...values];
  const cmp = compare ?? ((a, b) => a - b);
  const less = (i, j) => cmp(arr[i], arr[j]) < 0;
  function swap(i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  function siftDown(i, end) {
    while (true) {
      const left = i * 2 + 1;
      const right = i * 2 + 2;
      let max = i;
      if (left <= end && less(max, left)) max = left;
      if (right <= end && less(max, right)) max = right;
      if (max === i) return;
      swap(i, max);
      i = max;
    }
  }
  for (let i = Math.floor((arr.length - 2) / 2); i >= 0; i -= 1) {
    siftDown(i, arr.length - 1);
  }
  for (let end = arr.length - 1; end > 0; end -= 1) {
    swap(0, end);
    siftDown(0, end - 1);
  }
  return arr;
}

module.exports = { heapSort };

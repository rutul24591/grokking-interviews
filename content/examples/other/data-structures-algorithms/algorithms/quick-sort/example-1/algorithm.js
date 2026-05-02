function quickSort(values, compare) {
  const arr = [...values];
  const cmp = compare ?? ((a, b) => a - b);
  function partition(low, high) {
    const pivot = arr[high];
    let i = low;
    for (let j = low; j < high; j += 1) {
      if (cmp(arr[j], pivot) <= 0) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i += 1;
      }
    }
    [arr[i], arr[high]] = [arr[high], arr[i]];
    return i;
  }
  function sort(low, high) {
    if (low >= high) return;
    const p = partition(low, high);
    sort(low, p - 1);
    sort(p + 1, high);
  }
  sort(0, arr.length - 1);
  return arr;
}

module.exports = { quickSort };

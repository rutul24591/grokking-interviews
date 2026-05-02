function bubbleSort(values, compare) {
  const arr = [...values];
  const cmp = compare ?? ((a, b) => a - b);
  for (let i = 0; i < arr.length - 1; i += 1) {
    let swapped = false;
    for (let j = 0; j < arr.length - i - 1; j += 1) {
      if (cmp(arr[j], arr[j + 1]) > 0) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}

module.exports = { bubbleSort };

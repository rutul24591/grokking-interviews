function insertionSort(values, compare) {
  const arr = [...values];
  const cmp = compare ?? ((a, b) => a - b);
  for (let i = 1; i < arr.length; i += 1) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && cmp(arr[j], key) > 0) {
      arr[j + 1] = arr[j];
      j -= 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}

module.exports = { insertionSort };

function selectionSort(values, compare) {
  const arr = [...values];
  const cmp = compare ?? ((a, b) => a - b);
  for (let i = 0; i < arr.length; i += 1) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j += 1) {
      if (cmp(arr[j], arr[minIndex]) < 0) minIndex = j;
    }
    if (minIndex !== i) [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
  return arr;
}

module.exports = { selectionSort };

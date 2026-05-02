function shellSort(values, compare) {
  const arr = [...values];
  const cmp = compare ?? ((a, b) => a - b);
  let gap = Math.floor(arr.length / 2);
  while (gap > 0) {
    for (let i = gap; i < arr.length; i += 1) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && cmp(arr[j - gap], temp) > 0) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }
  return arr;
}

module.exports = { shellSort };

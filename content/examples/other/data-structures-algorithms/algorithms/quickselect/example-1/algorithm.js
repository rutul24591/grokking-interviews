function quickselect(values, k) {
  const arr = [...values];
  if (k < 0 || k >= arr.length) throw new RangeError("k out of range");
  let left = 0;
  let right = arr.length - 1;

  function partition(l, r) {
    const pivot = arr[r];
    let i = l;
    for (let j = l; j < r; j += 1) {
      if (arr[j] <= pivot) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i += 1;
      }
    }
    [arr[i], arr[r]] = [arr[r], arr[i]];
    return i;
  }

  while (true) {
    const p = partition(left, right);
    if (p === k) return arr[p];
    if (p < k) left = p + 1;
    else right = p - 1;
  }
}

module.exports = { quickselect };

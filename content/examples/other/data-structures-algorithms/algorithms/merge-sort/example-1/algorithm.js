function mergeSort(values, compare) {
  const cmp = compare ?? ((a, b) => a - b);
  function merge(left, right) {
    const out = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
      if (cmp(left[i], right[j]) <= 0) out.push(left[i++]);
      else out.push(right[j++]);
    }
    return out.concat(left.slice(i)).concat(right.slice(j));
  }
  function sort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    return merge(sort(arr.slice(0, mid)), sort(arr.slice(mid)));
  }
  return sort([...values]);
}

module.exports = { mergeSort };

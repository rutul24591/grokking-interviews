function findMissingNumber(nums) {
  const arr = [...nums];
  let i = 0;
  while (i < arr.length) {
    const j = arr[i];
    if (j < arr.length && arr[i] !== arr[j]) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
    } else {
      i += 1;
    }
  }
  for (let k = 0; k < arr.length; k += 1) {
    if (arr[k] !== k) return k;
  }
  return arr.length;
}

module.exports = { findMissingNumber };

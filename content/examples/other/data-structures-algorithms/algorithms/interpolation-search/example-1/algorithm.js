function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high && target >= arr[low] && target <= arr[high]) {
    const range = arr[high] - arr[low];
    if (range === 0) return arr[low] === target ? low : -1;
    const pos =
      low +
      Math.floor(((target - arr[low]) * (high - low)) / range);
    if (arr[pos] === target) return pos;
    if (arr[pos] < target) low = pos + 1;
    else high = pos - 1;
  }
  return -1;
}

module.exports = { interpolationSearch };

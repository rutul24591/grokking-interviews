function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n)) || 1;
  let prev = 0;
  let next = step;

  while (prev < n && arr[Math.min(next, n) - 1] < target) {
    prev = next;
    next += step;
    if (prev >= n) return -1;
  }
  for (let i = prev; i < Math.min(next, n); i += 1) {
    if (arr[i] === target) return i;
  }
  return -1;
}

module.exports = { jumpSearch };

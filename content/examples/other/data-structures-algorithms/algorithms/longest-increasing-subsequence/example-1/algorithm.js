function lisLength(nums) {
  const tails = [];
  for (const num of nums) {
    let low = 0;
    let high = tails.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (tails[mid] < num) low = mid + 1;
      else high = mid;
    }
    tails[low] = num;
  }
  return tails.length;
}

module.exports = { lisLength };

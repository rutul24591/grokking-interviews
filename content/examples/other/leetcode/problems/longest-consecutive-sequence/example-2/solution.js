function longestConsecutiveHashSet(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    if (set.has(x - 1)) continue;
    let cur = 1;
    while (set.has(x + cur)) cur += 1;
    best = Math.max(best, cur);
  }
  return best;
}

if (require.main === module) {
  console.log(longestConsecutiveHashSet([100, 4, 200, 1, 3, 2]));
}

module.exports = { longestConsecutiveHashSet };

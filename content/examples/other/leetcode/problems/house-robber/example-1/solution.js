function robTopDown(nums) {
  const memo = new Map();
  function dfs(i) {
    if (i >= nums.length) return 0;
    if (memo.has(i)) return memo.get(i);
    const best = Math.max(dfs(i + 1), nums[i] + dfs(i + 2));
    memo.set(i, best);
    return best;
  }
  return dfs(0);
}

if (require.main === module) {
  console.log(robTopDown([1, 2, 3, 1]));
}

module.exports = { robTopDown };

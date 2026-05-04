function coinChangeTopDown(coins, amount) {
  const memo = new Map();
  function dfs(remaining) {
    if (remaining === 0) return 0;
    if (remaining < 0) return Infinity;
    if (memo.has(remaining)) return memo.get(remaining);
    let best = Infinity;
    for (const c of coins) {
      const sub = dfs(remaining - c);
      if (sub !== Infinity) best = Math.min(best, sub + 1);
    }
    memo.set(remaining, best);
    return best;
  }

  const res = dfs(amount);
  return res === Infinity ? -1 : res;
}

if (require.main === module) {
  console.log(coinChangeTopDown([1, 2, 5], 11));
}

module.exports = { coinChangeTopDown };

function minCoins(coins, amount) {
  const memo = new Map();
  function solve(remaining) {
    if (remaining === 0) return 0;
    if (remaining < 0) return Infinity;
    if (memo.has(remaining)) return memo.get(remaining);
    let best = Infinity;
    for (const coin of coins) best = Math.min(best, solve(remaining - coin) + 1);
    memo.set(remaining, best);
    return best;
  }
  const result = solve(amount);
  return Number.isFinite(result) ? result : -1;
}

module.exports = { minCoins };

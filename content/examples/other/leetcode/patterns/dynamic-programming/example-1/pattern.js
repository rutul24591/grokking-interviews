function minCoins(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a += 1) {
    for (const coin of coins) {
      if (a - coin >= 0) dp[a] = Math.min(dp[a], dp[a - coin] + 1);
    }
  }
  return Number.isFinite(dp[amount]) ? dp[amount] : -1;
}

module.exports = { minCoins };

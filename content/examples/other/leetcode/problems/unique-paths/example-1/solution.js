function uniquePathsDP(m, n) {
  const dp = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let r = 0; r < m; r += 1) dp[r][0] = 1;
  for (let c = 0; c < n; c += 1) dp[0][c] = 1;
  for (let r = 1; r < m; r += 1) {
    for (let c = 1; c < n; c += 1) dp[r][c] = dp[r - 1][c] + dp[r][c - 1];
  }
  return dp[m - 1][n - 1];
}

if (require.main === module) {
  console.log(uniquePathsDP(3, 7));
}

module.exports = { uniquePathsDP };

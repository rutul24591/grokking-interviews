function uniquePaths1D(m, n) {
  const dp = new Array(n).fill(1);
  for (let r = 1; r < m; r += 1) {
    for (let c = 1; c < n; c += 1) dp[c] = dp[c] + dp[c - 1];
  }
  return dp[n - 1];
}

if (require.main === module) {
  console.log(uniquePaths1D(3, 7));
}

module.exports = { uniquePaths1D };

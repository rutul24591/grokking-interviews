def unique_paths_dp(m, n):
    dp = [[0] * n for _ in range(m)]
    for r in range(m):
        dp[r][0] = 1
    for c in range(n):
        dp[0][c] = 1
    for r in range(1, m):
        for c in range(1, n):
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    return dp[m - 1][n - 1]


if __name__ == "__main__":
    print(unique_paths_dp(3, 7))

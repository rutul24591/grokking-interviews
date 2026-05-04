def unique_paths_1d(m, n):
    dp = [1] * n
    for _ in range(1, m):
        for c in range(1, n):
            dp[c] = dp[c] + dp[c - 1]
    return dp[n - 1]


if __name__ == "__main__":
    print(unique_paths_1d(3, 7))

def coin_change_top_down(coins, amount):
    memo = {}

    def dfs(remaining):
        if remaining == 0:
            return 0
        if remaining < 0:
            return float("inf")
        if remaining in memo:
            return memo[remaining]
        best = float("inf")
        for c in coins:
            sub = dfs(remaining - c)
            if sub != float("inf"):
                best = min(best, sub + 1)
        memo[remaining] = best
        return best

    res = dfs(amount)
    return -1 if res == float("inf") else res


if __name__ == "__main__":
    print(coin_change_top_down([1, 2, 5], 11))

def rob_top_down(nums):
    memo = {}

    def dfs(i):
        if i >= len(nums):
            return 0
        if i in memo:
            return memo[i]
        best = max(dfs(i + 1), nums[i] + dfs(i + 2))
        memo[i] = best
        return best

    return dfs(0)


if __name__ == "__main__":
    print(rob_top_down([1, 2, 3, 1]))

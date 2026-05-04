def length_of_lis_dp(nums):
    dp = [1] * len(nums)
    best = 0
    for i in range(len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
        best = max(best, dp[i])
    return best


if __name__ == "__main__":
    print(length_of_lis_dp([10, 9, 2, 5, 3, 7, 101, 18]))

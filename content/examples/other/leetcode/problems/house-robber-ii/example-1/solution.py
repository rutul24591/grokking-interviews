def rob_linear_dp(nums, start, end):
    prev2 = 0
    prev1 = 0
    for i in range(start, end + 1):
        prev2, prev1 = prev1, max(prev1, prev2 + nums[i])
    return prev1


def rob_house_robber_ii(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    return max(rob_linear_dp(nums, 0, len(nums) - 2), rob_linear_dp(nums, 1, len(nums) - 1))


if __name__ == "__main__":
    print(rob_house_robber_ii([2, 3, 2]))
    print(rob_house_robber_ii([1, 2, 3, 1]))

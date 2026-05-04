def rob_linear(nums, start, end):
    take = 0
    skip = 0
    for i in range(start, end + 1):
        take, skip = skip + nums[i], max(skip, take)
    return max(take, skip)


def rob(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    return max(rob_linear(nums, 0, len(nums) - 2), rob_linear(nums, 1, len(nums) - 1))


if __name__ == "__main__":
    print(rob([2, 3, 2]))
    print(rob([1, 2, 3, 1]))

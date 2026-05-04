def longest_consecutive_sort(nums):
    if not nums:
        return 0
    nums.sort()
    best = 1
    cur = 1
    for i in range(1, len(nums)):
        if nums[i] == nums[i - 1]:
            continue
        if nums[i] == nums[i - 1] + 1:
            cur += 1
        else:
            cur = 1
        best = max(best, cur)
    return best


if __name__ == "__main__":
    print(longest_consecutive_sort([100, 4, 200, 1, 3, 2]))

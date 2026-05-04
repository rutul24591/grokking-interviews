def max_product(nums):
    if not nums:
        return 0
    current_max = nums[0]
    current_min = nums[0]
    best = nums[0]

    for x in nums[1:]:
        a = x
        b = x * current_max
        c = x * current_min
        current_max = max(a, b, c)
        current_min = min(a, b, c)
        best = max(best, current_max)
    return best


if __name__ == "__main__":
    print(max_product([2, 3, -2, 4]))

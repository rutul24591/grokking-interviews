def longest_consecutive_hashset(nums):
    s = set(nums)
    best = 0
    for x in s:
        if x - 1 in s:
            continue
        cur = 1
        while x + cur in s:
            cur += 1
        best = max(best, cur)
    return best


if __name__ == "__main__":
    print(longest_consecutive_hashset([100, 4, 200, 1, 3, 2]))

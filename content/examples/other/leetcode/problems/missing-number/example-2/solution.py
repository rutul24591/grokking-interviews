def missing_number(nums):
    x = 0
    for i in range(len(nums) + 1):
        x ^= i
    for v in nums:
        x ^= v
    return x


if __name__ == "__main__":
    print(missing_number([3, 0, 1]))

def find_min_linear(nums):
    best = float("inf")
    for x in nums:
        if x < best:
            best = x
    return best


if __name__ == "__main__":
    print(find_min_linear([3, 4, 5, 1, 2]))

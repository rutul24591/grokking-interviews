def search_linear(nums, target):
    for i, x in enumerate(nums):
        if x == target:
            return i
    return -1


if __name__ == "__main__":
    print(search_linear([4, 5, 6, 7, 0, 1, 2], 0))

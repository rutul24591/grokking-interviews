def missing_number_sort(nums):
    nums.sort()
    for i, x in enumerate(nums):
        if x != i:
            return i
    return len(nums)


if __name__ == "__main__":
    print(missing_number_sort([3, 0, 1]))

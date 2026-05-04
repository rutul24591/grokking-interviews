def contains_duplicate(nums):
    nums = sorted(nums)
    for i in range(1, len(nums)):
        if nums[i] == nums[i-1]:
            return True
    return False

if __name__ == '__main__':
    print(contains_duplicate([1,2,3,1]))

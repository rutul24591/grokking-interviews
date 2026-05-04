def find_min(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        if nums[left] < nums[right]:
            return nums[left]
        mid = left + (right - left) // 2
        if nums[mid] >= nums[left]:
            left = mid + 1
        else:
            right = mid
    return nums[left]


if __name__ == "__main__":
    print(find_min([3, 4, 5, 1, 2]))

def length_of_lis(nums):
    tails = []
    for x in nums:
        left, right = 0, len(tails)
        while left < right:
            mid = left + (right - left) // 2
            if tails[mid] < x:
                left = mid + 1
            else:
                right = mid
        if left == len(tails):
            tails.append(x)
        else:
            tails[left] = x
    return len(tails)


if __name__ == "__main__":
    print(length_of_lis([10, 9, 2, 5, 3, 7, 101, 18]))

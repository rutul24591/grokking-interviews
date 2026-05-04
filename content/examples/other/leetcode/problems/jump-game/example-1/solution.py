def can_jump_dp(nums):
    good = [False] * len(nums)
    good[-1] = True
    for i in range(len(nums) - 2, -1, -1):
        farthest = min(len(nums) - 1, i + nums[i])
        for j in range(i + 1, farthest + 1):
            if good[j]:
                good[i] = True
                break
    return good[0]


if __name__ == "__main__":
    print(can_jump_dp([2, 3, 1, 1, 4]))
    print(can_jump_dp([3, 2, 1, 0, 4]))

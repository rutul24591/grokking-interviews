def can_jump_greedy(nums):
    farthest = 0
    for i, x in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + x)
    return True


if __name__ == "__main__":
    print(can_jump_greedy([2, 3, 1, 1, 4]))
    print(can_jump_greedy([3, 2, 1, 0, 4]))

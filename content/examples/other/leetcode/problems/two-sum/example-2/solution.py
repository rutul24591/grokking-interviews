def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i
    return None

if __name__ == '__main__':
    print(two_sum([2,7,11,15], 9))

def three_sum_brute(nums):
    triples = set()
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                if nums[i] + nums[j] + nums[k] == 0:
                    t = tuple(sorted((nums[i], nums[j], nums[k])))
                    triples.add(t)
    return [list(t) for t in triples]


if __name__ == "__main__":
    print(three_sum_brute([-1, 0, 1, 2, -1, -4]))

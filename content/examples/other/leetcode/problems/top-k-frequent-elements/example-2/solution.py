def top_k_frequent_bucket(nums, k):
    freq = {}
    for x in nums:
        freq[x] = freq.get(x, 0) + 1

    buckets = [[] for _ in range(len(nums) + 1)]
    for num, count in freq.items():
        buckets[count].append(num)

    out = []
    for c in range(len(buckets) - 1, -1, -1):
        for num in buckets[c]:
            out.append(num)
            if len(out) == k:
                return out
    return out


if __name__ == "__main__":
    print(top_k_frequent_bucket([1, 1, 1, 2, 2, 3], 2))

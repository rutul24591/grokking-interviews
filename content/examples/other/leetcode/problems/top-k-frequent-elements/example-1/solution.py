def top_k_frequent_sort(nums, k):
    freq = {}
    for x in nums:
        freq[x] = freq.get(x, 0) + 1
    pairs = sorted(freq.items(), key=lambda p: -p[1])
    return [num for num, _ in pairs[:k]]


if __name__ == "__main__":
    print(top_k_frequent_sort([1, 1, 1, 2, 2, 3], 2))

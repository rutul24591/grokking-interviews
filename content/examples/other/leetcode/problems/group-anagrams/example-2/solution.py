def group_anagrams_count_key(strs):
    groups = {}
    for s in strs:
        counts = [0] * 26
        for ch in s:
            counts[ord(ch) - ord("a")] += 1
        key = tuple(counts)
        groups.setdefault(key, []).append(s)
    return list(groups.values())


if __name__ == "__main__":
    print(group_anagrams_count_key(["eat", "tea", "tan", "ate", "nat", "bat"]))

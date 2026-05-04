def group_anagrams_sort_key(strs):
    groups = {}
    for s in strs:
        key = "".join(sorted(s))
        groups.setdefault(key, []).append(s)
    return list(groups.values())


if __name__ == "__main__":
    print(group_anagrams_sort_key(["eat", "tea", "tan", "ate", "nat", "bat"]))

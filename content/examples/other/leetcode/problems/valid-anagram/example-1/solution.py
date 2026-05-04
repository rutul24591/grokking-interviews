def is_anagram_sort(s, t):
    if len(s) != len(t):
        return False
    return sorted(s) == sorted(t)


if __name__ == "__main__":
    print(is_anagram_sort("anagram", "nagaram"))
    print(is_anagram_sort("rat", "car"))

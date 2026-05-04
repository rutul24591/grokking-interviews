def is_anagram_counts(s, t):
    if len(s) != len(t):
        return False
    counts = [0] * 26
    for i in range(len(s)):
        counts[ord(s[i]) - ord("a")] += 1
        counts[ord(t[i]) - ord("a")] -= 1
    return all(x == 0 for x in counts)


if __name__ == "__main__":
    print(is_anagram_counts("anagram", "nagaram"))
    print(is_anagram_counts("rat", "car"))

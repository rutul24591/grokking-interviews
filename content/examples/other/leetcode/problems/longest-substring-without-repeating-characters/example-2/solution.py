def length_of_longest_substring(s):
    last = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last:
            left = max(left, last[ch] + 1)
        last[ch] = right
        best = max(best, right - left + 1)
    return best


if __name__ == "__main__":
    print(length_of_longest_substring("abcabcbb"))

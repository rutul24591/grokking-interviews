def count_substrings_brute(s):
    def is_pal(l, r):
        while l < r:
            if s[l] != s[r]:
                return False
            l += 1
            r -= 1
        return True

    count = 0
    for i in range(len(s)):
        for j in range(i, len(s)):
            if is_pal(i, j):
                count += 1
    return count


if __name__ == "__main__":
    print(count_substrings_brute("aaa"))

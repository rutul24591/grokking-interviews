def longest_palindrome(s):
    best_l = 0
    best_r = 0

    def expand(left, right):
        nonlocal best_l, best_r
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        l = left + 1
        r = right - 1
        if r - l > best_r - best_l:
            best_l, best_r = l, r

    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return s[best_l:best_r + 1]


if __name__ == "__main__":
    print(longest_palindrome("babad"))

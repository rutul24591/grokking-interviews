def longest_palindrome_brute(s):
    def is_pal(l, r):
        while l < r:
            if s[l] != s[r]:
                return False
            l += 1
            r -= 1
        return True

    best_l = 0
    best_r = -1
    for i in range(len(s)):
        for j in range(i, len(s)):
            if j - i <= best_r - best_l:
                continue
            if is_pal(i, j):
                best_l, best_r = i, j
    return s[best_l:best_r + 1]


if __name__ == "__main__":
    print(longest_palindrome_brute("babad"))

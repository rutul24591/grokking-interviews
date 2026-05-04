def lcs_naive(text1, text2):
    def dfs(i, j):
        if i == len(text1) or j == len(text2):
            return 0
        if text1[i] == text2[j]:
            return 1 + dfs(i + 1, j + 1)
        return max(dfs(i + 1, j), dfs(i, j + 1))

    return dfs(0, 0)


if __name__ == "__main__":
    print(lcs_naive("abcde", "ace"))

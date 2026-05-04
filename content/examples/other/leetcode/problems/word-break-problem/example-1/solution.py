def word_break_top_down(s, word_dict):
    words = set(word_dict)
    memo = {}

    def dfs(i):
        if i == len(s):
            return True
        if i in memo:
            return memo[i]
        for j in range(i + 1, len(s) + 1):
            if s[i:j] in words and dfs(j):
                memo[i] = True
                return True
        memo[i] = False
        return False

    return dfs(0)


if __name__ == "__main__":
    print(word_break_top_down("leetcode", ["leet", "code"]))

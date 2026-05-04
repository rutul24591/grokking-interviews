def num_decodings_top_down(s):
    memo = {}

    def dfs(i):
        if i == len(s):
            return 1
        if s[i] == "0":
            return 0
        if i in memo:
            return memo[i]

        ways = dfs(i + 1)
        if i + 1 < len(s):
            two = int(s[i:i + 2])
            if 10 <= two <= 26:
                ways += dfs(i + 2)
        memo[i] = ways
        return ways

    return dfs(0)


if __name__ == "__main__":
    print(num_decodings_top_down("226"))

def num_decodings(s):
    if not s:
        return 0
    dp2 = 1
    dp1 = 0 if s[0] == "0" else 1
    for i in range(2, len(s) + 1):
        cur = 0
        if s[i - 1] != "0":
            cur += dp1
        two = int(s[i - 2:i])
        if 10 <= two <= 26:
            cur += dp2
        dp2, dp1 = dp1, cur
    return dp1


if __name__ == "__main__":
    print(num_decodings("226"))

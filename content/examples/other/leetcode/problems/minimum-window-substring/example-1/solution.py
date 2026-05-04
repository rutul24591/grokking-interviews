def min_window_brute(s, t):
    def covers(substr):
        need = {}
        for ch in t:
            need[ch] = need.get(ch, 0) + 1
        for ch in substr:
            if ch in need:
                need[ch] -= 1
                if need[ch] == 0:
                    del need[ch]
        return len(need) == 0

    best = ""
    for i in range(len(s)):
        for j in range(i, len(s)):
            sub = s[i:j + 1]
            if best and len(sub) >= len(best):
                continue
            if covers(sub):
                best = sub
    return best


if __name__ == "__main__":
    print(min_window_brute("ADOBECODEBANC", "ABC"))

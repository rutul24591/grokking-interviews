def min_window(s, t):
    if not t:
        return ""
    need = {}
    for ch in t:
        need[ch] = need.get(ch, 0) + 1

    window = {}
    have = 0
    need_kinds = len(need)
    best_len = float("inf")
    best_left = 0
    left = 0

    for right, ch in enumerate(s):
        window[ch] = window.get(ch, 0) + 1
        if ch in need and window[ch] == need[ch]:
            have += 1

        while have == need_kinds:
            length = right - left + 1
            if length < best_len:
                best_len = length
                best_left = left
            drop = s[left]
            window[drop] -= 1
            if drop in need and window[drop] < need[drop]:
                have -= 1
            left += 1

    return "" if best_len == float("inf") else s[best_left:best_left + best_len]


if __name__ == "__main__":
    print(min_window("ADOBECODEBANC", "ABC"))

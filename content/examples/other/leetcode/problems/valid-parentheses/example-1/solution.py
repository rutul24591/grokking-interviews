def is_valid_parentheses_stack(s):
    stack = []
    open_to_close = {"(": ")", "[": "]", "{": "}"}
    for ch in s:
        if ch in open_to_close:
            stack.append(ch)
            continue
        if not stack:
            return False
        open_ch = stack.pop()
        if open_to_close[open_ch] != ch:
            return False
    return len(stack) == 0


if __name__ == "__main__":
    print(is_valid_parentheses_stack("()[]{}"))
    print(is_valid_parentheses_stack("(]"))

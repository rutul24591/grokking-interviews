def is_valid_parentheses_fast(s):
    stack = []
    closing_to_opening = {")": "(", "]": "[", "}": "{"}
    for ch in s:
        if ch in closing_to_opening:
            if not stack or stack.pop() != closing_to_opening[ch]:
                return False
        else:
            stack.append(ch)
    return len(stack) == 0


if __name__ == "__main__":
    print(is_valid_parentheses_fast("()[]{}"))
    print(is_valid_parentheses_fast("([)]"))

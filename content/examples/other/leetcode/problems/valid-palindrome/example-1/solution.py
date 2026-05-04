import re


def is_palindrome_filtered(s):
    cleaned = re.sub(r"[^a-z0-9]", "", s.lower())
    left, right = 0, len(cleaned) - 1
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    return True


if __name__ == "__main__":
    print(is_palindrome_filtered("A man, a plan, a canal: Panama"))
    print(is_palindrome_filtered("race a car"))

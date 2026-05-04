def max_area(height):
    left, right = 0, len(height) - 1
    best = 0
    while left < right:
        area = min(height[left], height[right]) * (right - left)
        if area > best:
            best = area
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return best


if __name__ == "__main__":
    print(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))

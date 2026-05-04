def max_area_brute(height):
    best = 0
    for i in range(len(height)):
        for j in range(i + 1, len(height)):
            area = min(height[i], height[j]) * (j - i)
            if area > best:
                best = area
    return best


if __name__ == "__main__":
    print(max_area_brute([1, 8, 6, 2, 5, 4, 8, 3, 7]))

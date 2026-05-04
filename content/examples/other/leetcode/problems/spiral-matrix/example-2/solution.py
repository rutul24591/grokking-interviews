def spiral_order(matrix):
    out = []
    top = 0
    bottom = len(matrix) - 1
    left = 0
    right = len(matrix[0]) - 1 if matrix else -1

    while top <= bottom and left <= right:
        for c in range(left, right + 1):
            out.append(matrix[top][c])
        top += 1

        for r in range(top, bottom + 1):
            out.append(matrix[r][right])
        right -= 1

        if top <= bottom:
            for c in range(right, left - 1, -1):
                out.append(matrix[bottom][c])
            bottom -= 1

        if left <= right:
            for r in range(bottom, top - 1, -1):
                out.append(matrix[r][left])
            left += 1

    return out


if __name__ == "__main__":
    print(spiral_order([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))

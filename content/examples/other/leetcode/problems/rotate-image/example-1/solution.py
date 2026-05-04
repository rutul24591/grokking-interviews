def rotate_image_extra_matrix(matrix):
    n = len(matrix)
    out = [[0] * n for _ in range(n)]
    for r in range(n):
        for c in range(n):
            out[c][n - 1 - r] = matrix[r][c]
    for r in range(n):
        for c in range(n):
            matrix[r][c] = out[r][c]
    return matrix


if __name__ == "__main__":
    print(rotate_image_extra_matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))

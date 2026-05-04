def rotate(matrix):
    n = len(matrix)
    for r in range(n):
        for c in range(r + 1, n):
            matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]
    for r in range(n):
        matrix[r].reverse()
    return matrix


if __name__ == "__main__":
    print(rotate([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))

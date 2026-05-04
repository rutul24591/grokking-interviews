def set_zeroes(matrix):
    rows = len(matrix)
    cols = len(matrix[0]) if rows else 0
    first_row_zero = any(matrix[0][c] == 0 for c in range(cols)) if rows else False
    first_col_zero = any(matrix[r][0] == 0 for r in range(rows)) if cols else False

    for r in range(1, rows):
        for c in range(1, cols):
            if matrix[r][c] == 0:
                matrix[r][0] = 0
                matrix[0][c] = 0

    for r in range(1, rows):
        for c in range(1, cols):
            if matrix[r][0] == 0 or matrix[0][c] == 0:
                matrix[r][c] = 0

    if first_row_zero and rows:
        for c in range(cols):
            matrix[0][c] = 0
    if first_col_zero and cols:
        for r in range(rows):
            matrix[r][0] = 0
    return matrix


if __name__ == "__main__":
    print(set_zeroes([[1, 1, 1], [1, 0, 1], [1, 1, 1]]))

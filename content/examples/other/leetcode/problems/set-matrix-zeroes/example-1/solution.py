def set_zeroes_with_sets(matrix):
    rows = len(matrix)
    cols = len(matrix[0]) if rows else 0
    zero_rows = set()
    zero_cols = set()
    for r in range(rows):
        for c in range(cols):
            if matrix[r][c] == 0:
                zero_rows.add(r)
                zero_cols.add(c)
    for r in range(rows):
        for c in range(cols):
            if r in zero_rows or c in zero_cols:
                matrix[r][c] = 0
    return matrix


if __name__ == "__main__":
    print(set_zeroes_with_sets([[1, 1, 1], [1, 0, 1], [1, 1, 1]]))

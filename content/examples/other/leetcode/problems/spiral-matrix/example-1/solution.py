def spiral_order_visited(matrix):
    rows = len(matrix)
    cols = len(matrix[0]) if rows else 0
    visited = [[False] * cols for _ in range(rows)]
    out = []
    dirs = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    dir_idx = 0
    r = 0
    c = 0
    for _ in range(rows * cols):
        out.append(matrix[r][c])
        visited[r][c] = True
        dr, dc = dirs[dir_idx]
        nr, nc = r + dr, c + dc
        if nr < 0 or nc < 0 or nr >= rows or nc >= cols or visited[nr][nc]:
            dir_idx = (dir_idx + 1) % 4
        dr, dc = dirs[dir_idx]
        r += dr
        c += dc
    return out


if __name__ == "__main__":
    print(spiral_order_visited([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))

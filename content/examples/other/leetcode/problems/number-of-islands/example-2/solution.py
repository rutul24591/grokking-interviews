class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True


def num_islands_union_find(grid):
    rows = len(grid)
    cols = len(grid[0]) if rows else 0
    if rows == 0 or cols == 0:
        return 0

    def idx(r, c):
        return r * cols + c

    uf = UnionFind(rows * cols)
    islands = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] != "1":
                continue
            islands += 1
            if r > 0 and grid[r - 1][c] == "1":
                if uf.union(idx(r, c), idx(r - 1, c)):
                    islands -= 1
            if c > 0 and grid[r][c - 1] == "1":
                if uf.union(idx(r, c), idx(r, c - 1)):
                    islands -= 1
    return islands


if __name__ == "__main__":
    grid = [
        ["1", "1", "0", "0", "0"],
        ["1", "1", "0", "0", "0"],
        ["0", "0", "1", "0", "0"],
        ["0", "0", "0", "1", "1"],
    ]
    print(num_islands_union_find(grid))

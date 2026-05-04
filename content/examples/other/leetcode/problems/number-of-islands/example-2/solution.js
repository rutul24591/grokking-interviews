class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
  }
  find(x) {
    let cur = x;
    while (this.parent[cur] !== cur) {
      this.parent[cur] = this.parent[this.parent[cur]];
      cur = this.parent[cur];
    }
    return cur;
  }
  union(a, b) {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return false;
    if (this.rank[ra] < this.rank[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    if (this.rank[ra] === this.rank[rb]) this.rank[ra] += 1;
    return true;
  }
}

function numIslandsUnionFind(grid) {
  const rows = grid.length;
  const cols = rows === 0 ? 0 : grid[0].length;
  if (rows === 0 || cols === 0) return 0;

  const index = (r, c) => r * cols + c;
  const uf = new UnionFind(rows * cols);
  let islands = 0;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] !== "1") continue;
      islands += 1;
      if (r > 0 && grid[r - 1][c] === "1") {
        if (uf.union(index(r, c), index(r - 1, c))) islands -= 1;
      }
      if (c > 0 && grid[r][c - 1] === "1") {
        if (uf.union(index(r, c), index(r, c - 1))) islands -= 1;
      }
    }
  }

  return islands;
}

if (require.main === module) {
  const grid = [
    ["1", "1", "0", "0", "0"],
    ["1", "1", "0", "0", "0"],
    ["0", "0", "1", "0", "0"],
    ["0", "0", "0", "1", "1"],
  ];
  console.log(numIslandsUnionFind(grid));
}

module.exports = { numIslandsUnionFind };

class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.components = n;
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
    this.components -= 1;
    return true;
  }
}

function validTreeUnionFind(n, edges) {
  const uf = new UnionFind(n);
  for (const [u, v] of edges) {
    if (!uf.union(u, v)) return false;
  }
  return uf.components === 1;
}

if (require.main === module) {
  console.log(validTreeUnionFind(5, [[0, 1], [0, 2], [0, 3], [1, 4]]));
  console.log(validTreeUnionFind(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]));
}

module.exports = { validTreeUnionFind };

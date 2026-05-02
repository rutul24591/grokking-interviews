class UnionFind {
  constructor(nodes) {
    this.parent = new Map(nodes.map((n) => [n, n]));
    this.rank = new Map(nodes.map((n) => [n, 0]));
  }
  find(x) {
    const p = this.parent.get(x);
    if (p !== x) this.parent.set(x, this.find(p));
    return this.parent.get(x);
  }
  union(a, b) {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return false;
    const rka = this.rank.get(ra);
    const rkb = this.rank.get(rb);
    if (rka < rkb) [ra, rb] = [rb, ra];
    this.parent.set(rb, ra);
    if (rka === rkb) this.rank.set(ra, rka + 1);
    return true;
  }
}

function kruskal(nodes, edges) {
  const uf = new UnionFind(nodes);
  const sorted = [...edges].sort((a, b) => a.weight - b.weight);
  const chosen = [];
  for (const edge of sorted) {
    if (uf.union(edge.from, edge.to)) chosen.push(edge);
  }
  return chosen;
}

module.exports = { kruskal };

class UnionFind {
  constructor(items) {
    this.parent = new Map(items.map((x) => [x, x]));
    this.rank = new Map(items.map((x) => [x, 0]));
  }

  find(x) {
    const p = this.parent.get(x);
    if (p === undefined) throw new Error("unknown item");
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

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}

module.exports = { UnionFind };

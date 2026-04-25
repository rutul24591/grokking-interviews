class UnionFind {
  constructor(items) {
    this.parent = new Map(items.map((item) => [item, item]));
    this.rank = new Map(items.map((item) => [item, 0]));
  }

  find(item) {
    const parent = this.parent.get(item);
    if (parent !== item) this.parent.set(item, this.find(parent));
    return this.parent.get(item);
  }

  union(a, b) {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return false;

    const rankA = this.rank.get(rootA);
    const rankB = this.rank.get(rootB);
    if (rankA < rankB) this.parent.set(rootA, rootB);
    else if (rankA > rankB) this.parent.set(rootB, rootA);
    else {
      this.parent.set(rootB, rootA);
      this.rank.set(rootA, rankA + 1);
    }
    return true;
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}

module.exports = { UnionFind };

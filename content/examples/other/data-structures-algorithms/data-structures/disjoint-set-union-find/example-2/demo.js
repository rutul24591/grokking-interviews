const { UnionFind } = require("../example-1/union-find");

const uf = new UnionFind(["acct-1", "acct-2", "acct-3", "acct-4"]);
uf.union("acct-1", "acct-2");
uf.union("acct-2", "acct-3");

const groups = {};
for (const account of ["acct-1", "acct-2", "acct-3", "acct-4"]) {
  const root = uf.find(account);
  groups[root] ??= [];
  groups[root].push(account);
}

console.log("Merged account clusters:", groups);

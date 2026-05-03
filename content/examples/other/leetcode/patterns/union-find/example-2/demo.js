const { UnionFind } = require("../example-1/pattern");
const nodes = ["A","B","C","D"];
const edges = [["A","B"],["B","C"],["C","A"],["C","D"]];
const uf = new UnionFind(nodes);
let hasCycle = false;
for (const [u,v] of edges) {
  if (!uf.union(u,v)) { hasCycle = true; break; }
}
console.log("cycle?", hasCycle);

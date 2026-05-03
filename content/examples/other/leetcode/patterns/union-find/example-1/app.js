const { UnionFind } = require("./pattern");
const uf = new UnionFind(["a","b","c","d"]);
uf.union("a","b");
uf.union("c","d");
console.log(uf.connected("a","b"), uf.connected("a","c"));
uf.union("b","c");
console.log(uf.connected("a","d"));

const { UnionFind } = require("../example-1/pattern");
const uf = new UnionFind(["x"]);
console.log("x~x:", uf.connected("x","x"));
console.log("redundant union:", uf.union("x","x"));
try { uf.connected("x","y"); } catch (e) { console.log("unknown:", e.message); }

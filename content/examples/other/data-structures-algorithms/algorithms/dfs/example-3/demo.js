const { dfs } = require("../example-1/algorithm");
const graph = { A: ["A", "B"], B: ["C"], C: ["A"], D: [] };
console.log("From A:", dfs(graph, "A"));
console.log("From D:", dfs(graph, "D"));

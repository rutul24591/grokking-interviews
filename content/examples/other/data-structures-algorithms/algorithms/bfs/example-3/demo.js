const { bfs } = require("../example-1/algorithm");
const graph = { A: ["A", "B"], B: ["C"], C: ["A"], D: [] };
console.log("From A:", bfs(graph, "A"));
console.log("From D:", bfs(graph, "D"));

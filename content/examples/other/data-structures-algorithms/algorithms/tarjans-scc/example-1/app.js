const { tarjansScc } = require("./algorithm");
const graph = { A: ["B"], B: ["C"], C: ["A", "D"], D: ["E"], E: ["D"] };
console.log(tarjansScc(graph));

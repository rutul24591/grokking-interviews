const { dfs } = require("./algorithm");

const graph = {
  api: ["auth", "catalog"],
  auth: ["sessions"],
  catalog: ["search"],
  sessions: [],
  search: ["api"],
};

console.log("dfs order:", dfs(graph, "api"));

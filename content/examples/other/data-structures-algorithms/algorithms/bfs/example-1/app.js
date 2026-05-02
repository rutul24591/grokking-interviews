const { bfs } = require("./algorithm");

const graph = {
  api: ["auth", "catalog"],
  auth: ["sessions"],
  catalog: ["search"],
  sessions: [],
  search: ["api"],
};

console.log("bfs order:", bfs(graph, "api"));

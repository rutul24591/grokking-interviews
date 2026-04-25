const { UnionFind } = require("./union-find");

const zones = new UnionFind(["web", "api", "auth", "payments", "search"]);
zones.union("web", "api");
zones.union("api", "auth");
zones.union("payments", "search");

console.log("web ~ auth:", zones.connected("web", "auth"));
console.log("web ~ search:", zones.connected("web", "search"));
console.log("Parent map:", Object.fromEntries(zones.parent));

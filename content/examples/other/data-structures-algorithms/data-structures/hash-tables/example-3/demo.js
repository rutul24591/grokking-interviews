const { HashTable } = require("../example-1/hash-table");

const table = new HashTable();
table.set("config", { retries: 3 });
table.set("config", { retries: 5 });

console.log("Updated config:", table.get("config"));
console.log("Missing key:", table.get("missing"));

// Demonstrates ACID-like behavior with transfers.

const { snapshot } = require("./ledger");
const { transfer, log } = require("./transaction-manager");

console.log("Initial", snapshot());
console.log("Transfer 200", transfer("alice", "bob", 200));
console.log("Transfer 999", transfer("alice", "bob", 999));
console.log("Final", snapshot());
console.log("WAL", log());

// Demonstrates read-after-write inconsistency.

const { write, readFromPrimary, readFromReplica } = require("./replica");

write("order:1", { status: "paid" });

console.log("Primary", readFromPrimary("order:1"));
console.log("Replica (stale)", readFromReplica("order:1"));

setTimeout(() => {
  console.log("Replica (after lag)", readFromReplica("order:1"));
}, 300);

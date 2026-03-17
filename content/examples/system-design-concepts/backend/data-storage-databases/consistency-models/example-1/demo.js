// Demonstrates strong vs eventual consistency reads.

const { write, strongRead, eventualRead } = require("./replication");

write("item", { version: 1 });

console.log("Strong", strongRead("item"));
console.log("Eventual", eventualRead("item"));

setTimeout(() => {
  console.log("Eventual after lag", eventualRead("item"));
}, 300);

const { HashTable } = require("../example-1/hash-table");

const table = new HashTable(2);
["aa", "bb", "cc", "dd"].forEach((key, index) => {
  table.set(key, { value: index });
});

console.log("Buckets after forced collisions:", table.debugBuckets());
console.log("Lookup cc:", table.get("cc"));

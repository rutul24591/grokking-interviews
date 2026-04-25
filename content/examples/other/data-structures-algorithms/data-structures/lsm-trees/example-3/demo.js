const tables = [
  new Map([["acct:1", "__deleted__"]]),
  new Map([["acct:1", "active"]]),
];

function lookup(key) {
  for (const table of tables) {
    if (table.has(key)) return table.get(key);
  }
  return null;
}

console.log("Newest logical value:", lookup("acct:1"));
console.log("Observation: tombstones must be preserved until compaction makes older values unreachable.");

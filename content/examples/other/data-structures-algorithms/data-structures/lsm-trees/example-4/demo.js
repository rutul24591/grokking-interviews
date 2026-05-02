const wal = [];
let memtable = new Map();

function put(key, value) {
  wal.push({ op: "put", key, value });
  memtable.set(key, value);
}

put("k1", "v1");
put("k2", "v2");

console.log("Before crash memtable:", Object.fromEntries(memtable));

memtable = new Map();
for (const entry of wal) {
  if (entry.op === "put") memtable.set(entry.key, entry.value);
}

console.log("After replay memtable:", Object.fromEntries(memtable));

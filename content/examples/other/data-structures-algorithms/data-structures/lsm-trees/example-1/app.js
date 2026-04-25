const { LSMStore } = require("./lsm-store");

const store = new LSMStore(3);
store.put("user:1", "active");
store.put("user:2", "pending");
store.put("user:3", "suspended");
store.put("user:2", "active");

console.log("Memtable size:", store.memtable.size);
console.log("SSTable count:", store.sstables.length);
console.log("Lookup user:2:", store.get("user:2"));

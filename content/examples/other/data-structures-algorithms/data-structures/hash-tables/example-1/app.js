const { HashTable } = require("./hash-table");

const sessions = new HashTable(4);
sessions.set("sess-100", { userId: "u1", device: "web" });
sessions.set("sess-101", { userId: "u2", device: "ios" });
sessions.set("sess-102", { userId: "u3", device: "android" });
sessions.set("sess-101", { userId: "u2", device: "ios", refreshed: true });

console.log("Lookup sess-101:", sessions.get("sess-101"));
console.log("Bucket layout:", sessions.debugBuckets());

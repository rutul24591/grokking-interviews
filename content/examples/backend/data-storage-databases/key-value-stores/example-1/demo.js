// Demonstrates TTL expiration.

const { KeyValueStore } = require("./kv-store");

const kv = new KeyValueStore();
kv.set("session:1", { user: "ada" }, 200);

console.log("Immediate", kv.get("session:1"));
setTimeout(() => {
  console.log("After TTL", kv.get("session:1"));
}, 300);

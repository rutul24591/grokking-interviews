// Demonstrates shard routing for different keys.

const { hashShard, rangeShard } = require("./router");

console.log("Hash shard", hashShard("user-1"));
console.log("Hash shard", hashShard("user-2"));
console.log("Range shard", rangeShard(500));
console.log("Range shard", rangeShard(1500));
console.log("Range shard", rangeShard(2500));

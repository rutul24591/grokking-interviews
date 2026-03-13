// Shard routing for hash and range strategies.

const shards = ["shard-a", "shard-b", "shard-c"];

function hashShard(key) {
  let hash = 0;
  for (const ch of key) {
    hash = (hash * 31 + ch.charCodeAt(0)) % shards.length;
  }
  return shards[hash];
}

function rangeShard(userId) {
  if (userId < 1000) return shards[0];
  if (userId < 2000) return shards[1];
  return shards[2];
}

module.exports = { hashShard, rangeShard };

const shards = ['db-a', 'db-b', 'db-c'];

function shardForUser(userId) {
  const id = parseInt(userId, 10);
  return shards[id % shards.length];
}

function routeQuery(userId, sql) {
  const shard = shardForUser(userId);
  return { shard, sql };
}

console.log(routeQuery('42', 'SELECT * FROM orders WHERE user_id = 42'));

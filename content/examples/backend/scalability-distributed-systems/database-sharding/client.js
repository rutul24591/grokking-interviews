// Route request by shard key
const route = routeQuery('42', 'SELECT * FROM orders WHERE user_id = 42');
console.log('send to shard', route.shard);

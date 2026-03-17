// Query cache demo.

const cache = new Map();
const key = 'SELECT * FROM users WHERE id=1';
cache.set(key, { id: 1 });
console.log(cache.get(key));

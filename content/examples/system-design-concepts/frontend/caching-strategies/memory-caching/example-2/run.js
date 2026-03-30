const cache = new Map();
function set(key, value) {
  if (cache.has(key)) cache.delete(key);
  cache.set(key, { value, expiresAt: Date.now() + 5_000 });
  if (cache.size > 2) cache.delete(cache.keys().next().value);
}
set('a', 1); set('b', 2); set('c', 3);
console.log(Array.from(cache.entries()));

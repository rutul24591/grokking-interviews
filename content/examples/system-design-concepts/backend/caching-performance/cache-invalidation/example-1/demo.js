// Invalidation strategies.

const cache = new Map([['k','v']]);
cache.delete('k');
console.log(cache.has('k'));

// Negative cache.

const cache = new Map([['missing', null]]);
console.log(cache.get('missing'));

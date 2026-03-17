const cache = new Map();
function get(key) { return cache.get(key); }
function set(key, val) { cache.set(key, val); }
module.exports = { get, set };
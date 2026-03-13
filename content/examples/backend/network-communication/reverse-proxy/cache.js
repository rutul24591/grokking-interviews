const store = new Map();

export function cacheGet(key) {
  return store.get(key);
}

export function cacheSet(key, value) {
  store.set(key, value);
}
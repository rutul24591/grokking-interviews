// Minimal in-memory store (replace with Zustand/React Query in UI integration).
function createStore() {
  const map = new Map();
  return {
    get(key) { return map.get(key) ?? null; },
    set(key, value) { map.set(key, value); },
    delete(key) { map.delete(key); },
  };
}

module.exports = { createStore };

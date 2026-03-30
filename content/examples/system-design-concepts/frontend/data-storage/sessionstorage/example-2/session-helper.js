class MemorySessionStorage {
  constructor() {
    this.map = new Map();
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  setItem(key, value) {
    this.map.set(key, value);
  }
  removeItem(key) {
    this.map.delete(key);
  }
}

function createSessionStore(storage) {
  return {
    put(key, value) {
      storage.setItem(key, JSON.stringify(value));
    },
    get(key, fallback = null) {
      const raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    },
    clear(key) {
      storage.removeItem(key);
    }
  };
}

const store = createSessionStore(new MemorySessionStorage());
store.put("flow", { step: 2, email: "staff@example.com" });
console.log(store.get("flow"));
store.clear("flow");
console.log(store.get("flow", "gone"));


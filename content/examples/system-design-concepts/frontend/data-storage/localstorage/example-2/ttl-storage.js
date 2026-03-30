class MemoryStorage {
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

class TypedStorage {
  constructor(storage, namespace) {
    this.storage = storage;
    this.namespace = namespace;
  }
  fullKey(key) {
    return `${this.namespace}:${key}`;
  }
  set(key, value, ttlMs = 0) {
    const record = {
      value,
      expiresAt: ttlMs > 0 ? Date.now() + ttlMs : null
    };
    this.storage.setItem(this.fullKey(key), JSON.stringify(record));
  }
  get(key, fallback = null) {
    const raw = this.storage.getItem(this.fullKey(key));
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
        this.storage.removeItem(this.fullKey(key));
        return fallback;
      }
      return parsed.value;
    } catch {
      return fallback;
    }
  }
}

const storage = new TypedStorage(new MemoryStorage(), "prefs");
storage.set("theme", "dark", 1_000);
storage.set("budget", { maxKb: 180 });

console.log("theme now:", storage.get("theme"));
setTimeout(() => {
  console.log("theme after expiry:", storage.get("theme", "expired"));
  console.log("budget:", storage.get("budget"));
}, 1_100);


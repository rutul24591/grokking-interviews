/**
 * File: cache.js
 * What it does: Implements a tiny LRU-like cache with TTL and basic metrics.
 */
class Cache {{
  constructor({{ maxEntries = 100, ttlMs = 5000 }} = {{}}) {{
    this.maxEntries = maxEntries;
    this.ttlMs = ttlMs;
    this.store = new Map();
    this.hits = 0;
    this.misses = 0;
  }}

  _now() {{
    return Date.now();
  }}

  get(key) {{
    const entry = this.store.get(key);
    if (!entry) {{
      this.misses += 1;
      return null;
    }}
    if (entry.expiresAt < this._now()) {{
      this.store.delete(key);
      this.misses += 1;
      return null;
    }}
    this.store.delete(key);
    this.store.set(key, entry); // refresh LRU order
    this.hits += 1;
    return entry.value;
  }}

  set(key, value, ttlMs) {{
    if (this.store.has(key)) {{
      this.store.delete(key);
    }}
    if (this.store.size >= this.maxEntries) {{
      const oldest = this.store.keys().next().value;
      this.store.delete(oldest);
    }}
    this.store.set(key, {{ value, expiresAt: this._now() + (ttlMs || this.ttlMs) }});
  }}

  invalidate(key) {{
    this.store.delete(key);
  }}

  stats() {{
    return {{
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses === 0 ? 0 : this.hits / (this.hits + this.misses),
    }};
  }}
}}

module.exports = Cache;

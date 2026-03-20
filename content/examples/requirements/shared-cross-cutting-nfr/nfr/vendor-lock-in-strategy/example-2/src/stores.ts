export type Obj = { key: string; value: string; updatedAt: number };

export interface ObjectStore {
  put(key: string, value: string): Promise<void>;
  get(key: string): Promise<Obj | null>;
  list(prefix?: string): Promise<Obj[]>;
  del(key: string): Promise<boolean>;
}

export class InMemoryStore implements ObjectStore {
  private map = new Map<string, Obj>();

  async put(key: string, value: string): Promise<void> {
    this.map.set(key, { key, value, updatedAt: Date.now() });
  }

  async get(key: string): Promise<Obj | null> {
    return this.map.get(key) ?? null;
  }

  async list(prefix?: string): Promise<Obj[]> {
    const out: Obj[] = [];
    for (const v of this.map.values()) {
      if (prefix && !v.key.startsWith(prefix)) continue;
      out.push(v);
    }
    out.sort((a, b) => b.updatedAt - a.updatedAt);
    return out;
  }

  async del(key: string): Promise<boolean> {
    return this.map.delete(key);
  }
}

// A subtly broken adapter that violates the contract (common in real migrations).
// It drops overwrites, which can cause silent data divergence.
export class BrokenNoOverwriteStore implements ObjectStore {
  private map = new Map<string, Obj>();

  async put(key: string, value: string): Promise<void> {
    if (this.map.has(key)) return; // BUG: ignores overwrites
    this.map.set(key, { key, value, updatedAt: Date.now() });
  }

  async get(key: string): Promise<Obj | null> {
    return this.map.get(key) ?? null;
  }

  async list(prefix?: string): Promise<Obj[]> {
    const out: Obj[] = [];
    for (const v of this.map.values()) {
      if (prefix && !v.key.startsWith(prefix)) continue;
      out.push(v);
    }
    return out;
  }

  async del(key: string): Promise<boolean> {
    return this.map.delete(key);
  }
}


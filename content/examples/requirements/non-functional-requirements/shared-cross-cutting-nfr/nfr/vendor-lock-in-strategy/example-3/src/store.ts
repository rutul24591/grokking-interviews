import crypto from "node:crypto";

export type Obj = { key: string; value: string; checksum: string; updatedAt: number };

export interface ObjectStore {
  put(key: string, value: string): Promise<Obj>;
  get(key: string): Promise<Obj | null>;
  listKeys(): Promise<string[]>;
  del(key: string): Promise<boolean>;
}

export function checksum(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export class InMemoryStore implements ObjectStore {
  private map = new Map<string, Obj>();

  async put(key: string, value: string): Promise<Obj> {
    const obj: Obj = { key, value, checksum: checksum(value), updatedAt: Date.now() };
    this.map.set(key, obj);
    return obj;
  }

  async get(key: string): Promise<Obj | null> {
    return this.map.get(key) ?? null;
  }

  async listKeys(): Promise<string[]> {
    return [...this.map.keys()].sort();
  }

  async del(key: string): Promise<boolean> {
    return this.map.delete(key);
  }
}


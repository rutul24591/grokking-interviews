type Obj = { key: string; value: string; updatedAt: number; etag: string };

const objects = new Map<string, Obj>();

export function mockS3Reset() {
  objects.clear();
}

export function mockS3Put(key: string, value: string, etag: string) {
  const obj: Obj = { key, value, updatedAt: Date.now(), etag };
  objects.set(key, obj);
  return obj;
}

export function mockS3Get(key: string): Obj | null {
  return objects.get(key) ?? null;
}

export function mockS3Delete(key: string): boolean {
  return objects.delete(key);
}

export function mockS3List(prefix?: string): Obj[] {
  const out: Obj[] = [];
  for (const obj of objects.values()) {
    if (prefix && !obj.key.startsWith(prefix)) continue;
    out.push(obj);
  }
  out.sort((a, b) => b.updatedAt - a.updatedAt);
  return out;
}


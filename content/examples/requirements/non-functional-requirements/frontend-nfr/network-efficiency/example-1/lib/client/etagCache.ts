type Entry = { etag: string; value: unknown; at: number };
const KEY = "net.etagCache";

function read(): Record<string, Entry> {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Entry>;
  } catch {
    return {};
  }
}

function write(v: Record<string, Entry>) {
  window.localStorage.setItem(KEY, JSON.stringify(v));
}

export function getCached<T>(k: string): { etag: string; value: T } | null {
  const map = read();
  const e = map[k];
  if (!e) return null;
  return { etag: e.etag, value: e.value as T };
}

export function setCached<T>(k: string, etag: string, value: T) {
  const map = read();
  map[k] = { etag, value, at: Date.now() };
  write(map);
}


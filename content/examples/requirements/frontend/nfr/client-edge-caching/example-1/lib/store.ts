type Origin = { version: number; payload: string; etag: string };
type CacheEntry = { origin: Origin; cachedAtMs: number; expiresAtMs: number };

const state = {
  originVersion: 0,
  originHits: 0,
  edgeHits: 0,
  edgeMisses: 0,
  cache: new Map<string, CacheEntry>(),
};

function buildOrigin(version: number): Origin {
  const payload = `origin-v${version}`;
  const etag = `W/\"${version}\"`;
  return { version, payload, etag };
}

export function originRead(): Origin {
  state.originHits++;
  state.originVersion++;
  return buildOrigin(state.originVersion);
}

export function edgeRead(key: string, ttlMs: number): { hit: boolean; entry: CacheEntry } {
  const now = Date.now();
  const existing = state.cache.get(key);
  if (existing && now < existing.expiresAtMs) {
    state.edgeHits++;
    return { hit: true, entry: existing };
  }

  state.edgeMisses++;
  const origin = originRead();
  const entry: CacheEntry = { origin, cachedAtMs: now, expiresAtMs: now + ttlMs };
  state.cache.set(key, entry);
  return { hit: false, entry };
}

export function stats() {
  return {
    originVersion: state.originVersion,
    originHits: state.originHits,
    edgeHits: state.edgeHits,
    edgeMisses: state.edgeMisses,
    cacheEntries: state.cache.size,
  };
}

export function reset() {
  state.originVersion = 0;
  state.originHits = 0;
  state.edgeHits = 0;
  state.edgeMisses = 0;
  state.cache.clear();
}


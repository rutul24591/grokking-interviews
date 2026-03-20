import type { ObjectStore } from "./store.js";
import { checksum } from "./store.js";

export type MigrationState = {
  cursor: number;
  copied: number;
  verified: number;
};

export async function dualWritePut(
  primary: ObjectStore,
  secondary: ObjectStore,
  key: string,
  value: string,
): Promise<void> {
  // Production note: use idempotency keys + retries and record per-store outcomes.
  await primary.put(key, value);
  await secondary.put(key, value);
}

export async function readWithRepair(
  preferred: ObjectStore,
  fallback: ObjectStore,
  key: string,
): Promise<{ value: string; repaired: boolean } | null> {
  const p = await preferred.get(key);
  if (p) return { value: p.value, repaired: false };
  const f = await fallback.get(key);
  if (!f) return null;
  await preferred.put(key, f.value);
  return { value: f.value, repaired: true };
}

export async function backfillBatch(
  source: ObjectStore,
  target: ObjectStore,
  state: MigrationState,
  batchSize: number,
): Promise<{ done: boolean; state: MigrationState }> {
  const keys = await source.listKeys();
  const batch = keys.slice(state.cursor, state.cursor + batchSize);

  for (const key of batch) {
    const src = await source.get(key);
    if (!src) continue;
    const dst = await target.get(key);
    if (dst && dst.checksum === src.checksum) continue; // idempotent
    await target.put(key, src.value);
    state.copied++;
  }

  state.cursor += batch.length;
  return { done: state.cursor >= keys.length, state };
}

export async function verifyAll(source: ObjectStore, target: ObjectStore): Promise<{ ok: boolean; mismatches: number }> {
  const keys = await source.listKeys();
  let mismatches = 0;
  for (const key of keys) {
    const s = await source.get(key);
    const t = await target.get(key);
    if (!s || !t || t.checksum !== checksum(s.value)) mismatches++;
  }
  return { ok: mismatches === 0, mismatches };
}


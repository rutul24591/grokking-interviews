import { randomUUID } from "node:crypto";

declare global {
  // eslint-disable-next-line no-var
  var __DEMO_REFRESH__: Map<string, { userId: string; familyId: string; used: boolean }> | undefined;
  // eslint-disable-next-line no-var
  var __DEMO_ACCESS__: Map<string, { userId: string; expMs: number }> | undefined;
  // eslint-disable-next-line no-var
  var __DEMO_REFRESH_COUNT__: number | undefined;
}

const refreshStore = (globalThis.__DEMO_REFRESH__ ??= new Map());
const accessStore = (globalThis.__DEMO_ACCESS__ ??= new Map());
globalThis.__DEMO_REFRESH_COUNT__ ??= 0;

export function issueRefresh(userId: string) {
  const token = `r_${randomUUID()}`;
  const familyId = `f_${randomUUID()}`;
  refreshStore.set(token, { userId, familyId, used: false });
  return { token, familyId };
}

export function rotateRefresh(oldToken: string) {
  const rec = refreshStore.get(oldToken);
  if (!rec) return { ok: false as const, error: "missing_refresh" };
  if (rec.used) {
    // Replay detection hook: revoke family in real systems.
    return { ok: false as const, error: "refresh_replay_detected", familyId: rec.familyId };
  }
  rec.used = true;
  const next = `r_${randomUUID()}`;
  refreshStore.set(next, { userId: rec.userId, familyId: rec.familyId, used: false });
  return { ok: true as const, nextToken: next, userId: rec.userId };
}

export function issueAccess(userId: string, ttlMs: number) {
  const token = `a_${randomUUID()}`;
  const expMs = Date.now() + ttlMs;
  accessStore.set(token, { userId, expMs });
  return { token, expMs };
}

export function verifyAccess(token: string) {
  const rec = accessStore.get(token);
  if (!rec) return { ok: false as const, error: "unknown_access" };
  if (Date.now() > rec.expMs) return { ok: false as const, error: "expired" };
  return { ok: true as const, userId: rec.userId, expMs: rec.expMs };
}

export function bumpRefreshCount() {
  globalThis.__DEMO_REFRESH_COUNT__ = (globalThis.__DEMO_REFRESH_COUNT__ ?? 0) + 1;
  return globalThis.__DEMO_REFRESH_COUNT__;
}


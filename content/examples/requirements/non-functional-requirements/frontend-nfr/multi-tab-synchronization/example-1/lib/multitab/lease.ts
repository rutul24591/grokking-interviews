export type Lease = { tabId: string; expiresAt: number };

const LEASE_KEY = "mt.leader";

export function readLease(): Lease | null {
  const raw = window.localStorage.getItem(LEASE_KEY);
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Lease;
    if (!v.tabId || typeof v.expiresAt !== "number") return null;
    return v;
  } catch {
    return null;
  }
}

export function writeLease(lease: Lease) {
  window.localStorage.setItem(LEASE_KEY, JSON.stringify(lease));
}

export function tryAcquireLease(tabId: string, ttlMs: number) {
  const now = Date.now();
  const current = readLease();
  if (!current || current.expiresAt <= now) {
    const next: Lease = { tabId, expiresAt: now + ttlMs };
    writeLease(next);
    return true;
  }
  return current.tabId === tabId;
}

export function renewLease(tabId: string, ttlMs: number) {
  const now = Date.now();
  const cur = readLease();
  if (!cur || cur.tabId !== tabId) return false;
  writeLease({ tabId, expiresAt: now + ttlMs });
  return true;
}

export function isLeader(tabId: string) {
  const cur = readLease();
  return !!cur && cur.tabId === tabId && cur.expiresAt > Date.now();
}


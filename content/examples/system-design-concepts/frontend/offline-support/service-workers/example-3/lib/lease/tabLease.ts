function safeNow() {
  return Date.now();
}

export function getOrCreateTabId(): string {
  if (typeof window === "undefined") return "server";
  const existing = sessionStorage.getItem("tabId");
  if (existing) return existing;
  const id = crypto.randomUUID();
  sessionStorage.setItem("tabId", id);
  return id;
}

type Lease = { tabId: string; expiresAt: number };

const KEY = "swActivationLease";

export function acquireActivationLease(params: { tabId: string; ttlMs: number }): boolean {
  if (typeof window === "undefined") return false;
  const now = safeNow();

  const currentRaw = localStorage.getItem(KEY);
  const current: Lease | null = currentRaw ? (JSON.parse(currentRaw) as Lease) : null;

  if (!current || current.expiresAt <= now || current.tabId === params.tabId) {
    const next: Lease = { tabId: params.tabId, expiresAt: now + params.ttlMs };
    localStorage.setItem(KEY, JSON.stringify(next));
    return true;
  }

  return false;
}

export function releaseActivationLease(params: { tabId: string }) {
  if (typeof window === "undefined") return;
  const currentRaw = localStorage.getItem(KEY);
  if (!currentRaw) return;
  const current = JSON.parse(currentRaw) as Lease;
  if (current.tabId === params.tabId) localStorage.removeItem(KEY);
}


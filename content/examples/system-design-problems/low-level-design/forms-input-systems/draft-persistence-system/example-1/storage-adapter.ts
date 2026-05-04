export type DraftEnvelope<T> = {
  version: number;
  revision: number;
  updatedAt: number;
  expiresAt: number;
  value: T;
};

export function getLocalStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadDraft<T>(key: string, expectedVersion: number): DraftEnvelope<T> | null {
  const ls = getLocalStorage();
  if (!ls) return null;
  const raw = ls.getItem(key);
  if (!raw) return null;
  const parsed = JSON.parse(raw) as DraftEnvelope<T>;
  if (parsed.version !== expectedVersion) return null;
  if (Date.now() > parsed.expiresAt) return null;
  return parsed;
}

export function saveDraft<T>(key: string, draft: DraftEnvelope<T>) {
  const ls = getLocalStorage();
  if (!ls) return;
  ls.setItem(key, JSON.stringify(draft));
}


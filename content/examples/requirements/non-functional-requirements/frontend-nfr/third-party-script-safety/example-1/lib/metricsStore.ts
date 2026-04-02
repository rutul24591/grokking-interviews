import type { ThirdPartyMessage } from "@/lib/messages";

export type StoredThirdPartyMessage = ThirdPartyMessage & {
  receivedAt: string;
  ip: string | null;
  ua: string | null;
};

const STORE_KEY = "__third_party_metrics_store_v1__";

function store(): StoredThirdPartyMessage[] {
  const g = globalThis as unknown as Record<string, unknown>;
  const existing = g[STORE_KEY];
  if (Array.isArray(existing)) return existing as StoredThirdPartyMessage[];
  const created: StoredThirdPartyMessage[] = [];
  g[STORE_KEY] = created;
  return created;
}

export function appendMetric(msg: ThirdPartyMessage, meta: { ip: string | null; ua: string | null }) {
  const s = store();
  s.unshift({
    ...msg,
    receivedAt: new Date().toISOString(),
    ip: meta.ip ?? null,
    ua: meta.ua ?? null,
  });
  if (s.length > 200) s.length = 200;
}

export function listRecent(limit: number) {
  return store().slice(0, limit);
}


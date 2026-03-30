export type QueuedCall = {
  id: string;
  method: "GET";
  url: string;
  queuedAt: number;
};

const KEY = "queuedCalls";

function safeParse(raw: string | null): QueuedCall[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v as QueuedCall[];
  } catch {
    return [];
  }
}

export function loadQueue(): QueuedCall[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(KEY));
}

export function pushQueue(item: { method: "GET"; url: string }): QueuedCall {
  if (typeof window === "undefined") throw new Error("pushQueue must run in the browser");
  const next: QueuedCall = { id: crypto.randomUUID(), method: item.method, url: item.url, queuedAt: Date.now() };
  const all = loadQueue();
  all.push(next);
  localStorage.setItem(KEY, JSON.stringify(all));
  return next;
}

export function removeQueueItem(id: string) {
  if (typeof window === "undefined") return;
  const all = loadQueue().filter((x) => x.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}


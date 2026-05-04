export type Presence = {
  userId: string;
  docId: string;
  cursor: { x: number; y: number };
  color: string;
  lastSeenAt: number;
};

export type PresenceState = {
  byUser: Record<string, Presence>;
};

export function upsert(state: PresenceState, p: Presence) {
  const prev = state.byUser[p.userId];
  if (prev && prev.lastSeenAt > p.lastSeenAt) return state; // out-of-order guard
  return { ...state, byUser: { ...state.byUser, [p.userId]: p } };
}

export function prune(state: PresenceState, ttlMs = 15_000, now = Date.now()) {
  const byUser = { ...state.byUser };
  for (const [uid, p] of Object.entries(byUser)) if (now - p.lastSeenAt > ttlMs) delete byUser[uid];
  return { ...state, byUser };
}

export function throttle<TArgs extends unknown[]>(fn: (...args: TArgs) => void, ms: number) {
  let last = 0;
  let scheduled: ReturnType<typeof setTimeout> | null = null;
  let latest: TArgs | null = null;
  return (...args: TArgs) => {
    const now = Date.now();
    latest = args;
    if (now - last >= ms) {
      last = now;
      fn(...args);
      return;
    }
    if (scheduled) return;
    scheduled = setTimeout(() => {
      scheduled = null;
      last = Date.now();
      if (latest) fn(...latest);
    }, ms - (now - last));
  };
}

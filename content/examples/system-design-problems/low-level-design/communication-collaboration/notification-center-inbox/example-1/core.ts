export type Notification = {
  id: string;
  kind: string;
  createdAt: number;
  readAt: number | null;
  groupKey?: string; // e.g., threadId
  payload: Record<string, unknown>;
};

export type InboxState = {
  byId: Record<string, Notification>;
  order: string[]; // newest-first ids
  unreadCount: number;
  lastSeenAt: number;
};

export function upsert(state: InboxState, items: Notification[]) {
  const byId = { ...state.byId };
  const order = [...state.order];
  const seen = new Set(order);

  for (const n of items) {
    byId[n.id] = { ...byId[n.id], ...n };
    if (!seen.has(n.id)) {
      order.unshift(n.id);
      seen.add(n.id);
    }
  }

  order.sort((a, b) => (byId[b]?.createdAt ?? 0) - (byId[a]?.createdAt ?? 0));
  const unreadCount = order.reduce((acc, id) => acc + (byId[id]?.readAt ? 0 : 1), 0);

  return { ...state, byId, order, unreadCount };
}

export function markRead(state: InboxState, id: string, at = Date.now()) {
  const n = state.byId[id];
  if (!n || n.readAt) return state;
  const byId = { ...state.byId, [id]: { ...n, readAt: at } };
  return { ...state, byId, unreadCount: Math.max(0, state.unreadCount - 1) };
}

export function markAllRead(state: InboxState, at = Date.now()) {
  const byId = { ...state.byId };
  for (const id of state.order) {
    const n = byId[id];
    if (n && !n.readAt) byId[id] = { ...n, readAt: at };
  }
  return { ...state, byId, unreadCount: 0 };
}

export function group(state: InboxState) {
  const groups: Record<string, string[]> = {};
  for (const id of state.order) {
    const n = state.byId[id];
    const key = n.groupKey ?? `__${n.kind}`;
    (groups[key] ??= []).push(id);
  }
  return groups;
}

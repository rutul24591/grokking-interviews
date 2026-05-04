export type MessageId = string;

export type DeliveryState = "sending" | "sent" | "delivered" | "read" | "failed";

export type Message = {
  id: MessageId;
  threadId: string;
  senderId: string;
  text: string;
  ts: number;
  delivery: DeliveryState;
};

export type ChatState = {
  // canonical store
  messagesById: Record<MessageId, Message>;
  // per-thread ordered ids (append-only; reconcile via server snapshots)
  threadOrder: Record<string, MessageId[]>;
  // viewport model for upward infinite scroll
  oldestCursorByThread: Record<string, string | null>;
  hasMoreByThread: Record<string, boolean>;
  typingByThread: Record<string, Record<string, number>>; // userId -> lastTypedAt
  readReceiptByThread: Record<string, Record<string, number>>; // userId -> lastReadTs
};

export function upsertMessages(state: ChatState, threadId: string, msgs: Message[]) {
  const messagesById = { ...state.messagesById };
  const order = state.threadOrder[threadId] ? [...state.threadOrder[threadId]] : [];
  const seen = new Set(order);

  for (const m of msgs) {
    messagesById[m.id] = { ...messagesById[m.id], ...m };
    if (!seen.has(m.id)) {
      order.push(m.id);
      seen.add(m.id);
    }
  }

  order.sort((a, b) => messagesById[a].ts - messagesById[b].ts);

  return {
    ...state,
    messagesById,
    threadOrder: { ...state.threadOrder, [threadId]: order },
  };
}

export function groupForRendering(state: ChatState, threadId: string, maxGapMs = 5 * 60_000) {
  const ids = state.threadOrder[threadId] ?? [];
  const out: Array<{ key: string; senderId: string; ids: MessageId[] }> = [];
  let current: { key: string; senderId: string; ids: MessageId[]; lastTs: number } | null = null;

  for (const id of ids) {
    const m = state.messagesById[id];
    if (!m) continue;
    if (!current || current.senderId != m.senderId || m.ts - current.lastTs > maxGapMs) {
      current = { key: `g:${m.senderId}:${m.ts}`, senderId: m.senderId, ids: [id], lastTs: m.ts };
      out.push({ key: current.key, senderId: current.senderId, ids: current.ids });
    } else {
      current.ids.push(id);
      current.lastTs = m.ts;
    }
  }
  return out;
}

export function applyReadReceipt(state: ChatState, threadId: string, userId: string, lastReadTs: number) {
  const rr = { ...(state.readReceiptByThread[threadId] ?? {}) };
  rr[userId] = Math.max(rr[userId] ?? 0, lastReadTs);
  return { ...state, readReceiptByThread: { ...state.readReceiptByThread, [threadId]: rr } };
}

export function applyTyping(state: ChatState, threadId: string, userId: string, now = Date.now()) {
  const t = { ...(state.typingByThread[threadId] ?? {}) };
  t[userId] = now;
  return { ...state, typingByThread: { ...state.typingByThread, [threadId]: t } };
}

export function pruneTyping(state: ChatState, threadId: string, ttlMs = 6_000, now = Date.now()) {
  const t = { ...(state.typingByThread[threadId] ?? {}) };
  for (const [uid, ts] of Object.entries(t)) if (now - ts > ttlMs) delete t[uid];
  return { ...state, typingByThread: { ...state.typingByThread, [threadId]: t } };
}

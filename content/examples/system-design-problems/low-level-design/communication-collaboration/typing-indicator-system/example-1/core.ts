export type TypingState = {
  byThread: Record<string, Record<string, number>>; // threadId -> userId -> lastTypedAt
};

export function setTyping(s: TypingState, threadId: string, userId: string, at = Date.now()) {
  const t = { ...(s.byThread[threadId] ?? {}) };
  t[userId] = at;
  return { ...s, byThread: { ...s.byThread, [threadId]: t } };
}

export function pruneTyping(s: TypingState, threadId: string, ttlMs = 6_000, now = Date.now()) {
  const t = { ...(s.byThread[threadId] ?? {}) };
  for (const [uid, ts] of Object.entries(t)) if (now - ts > ttlMs) delete t[uid];
  return { ...s, byThread: { ...s.byThread, [threadId]: t } };
}

export function currentlyTyping(s: TypingState, threadId: string, ttlMs = 6_000, now = Date.now()) {
  const t = s.byThread[threadId] ?? {};
  return Object.keys(t).filter((uid) => now - t[uid] <= ttlMs);
}

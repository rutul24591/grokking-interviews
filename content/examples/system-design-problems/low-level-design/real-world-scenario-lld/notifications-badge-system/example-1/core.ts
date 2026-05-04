export type BadgeState = { unread: number; lastSeenAt: number };

export function onNew(state: BadgeState, count = 1) {
  return { ...state, unread: state.unread + count };
}

export function markSeen(state: BadgeState, at = Date.now()) {
  return { unread: 0, lastSeenAt: at };
}

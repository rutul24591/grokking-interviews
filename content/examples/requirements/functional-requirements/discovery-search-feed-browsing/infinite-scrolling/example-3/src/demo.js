function cursorRecovery({ cursor, lastVisibleId, incomingIds }) {
  if (incomingIds.includes(lastVisibleId)) return { action: "append", nextCursor: cursor + incomingIds.length };
  return { action: "reset-from-last-visible", nextCursor: cursor };
}

console.log(cursorRecovery({ cursor: 6, lastVisibleId: "card-6", incomingIds: ["card-6", "card-7"] }));
console.log(cursorRecovery({ cursor: 6, lastVisibleId: "card-6", incomingIds: ["card-8", "card-9"] }));

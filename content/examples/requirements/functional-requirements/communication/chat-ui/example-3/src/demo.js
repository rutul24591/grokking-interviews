function detectChatEdgeCases(events) {
  return events.map((entry) => ({
    thread: entry.thread,
    suppressDuplicate: entry.sameClientId && entry.samePayload,
    rebuildTimeline: entry.outOfOrderAck || entry.threadArchived,
    showRecoveryBanner: entry.retryBudgetExhausted || entry.roomMissing
  }));
}

console.log(JSON.stringify(detectChatEdgeCases([
  { thread: "support lane", sameClientId: true, samePayload: true, outOfOrderAck: false, threadArchived: false, retryBudgetExhausted: false, roomMissing: false },
  { thread: "escalation", sameClientId: false, samePayload: false, outOfOrderAck: true, threadArchived: false, retryBudgetExhausted: true, roomMissing: false },
  { thread: "ops mirror", sameClientId: false, samePayload: false, outOfOrderAck: false, threadArchived: true, retryBudgetExhausted: false, roomMissing: true }
]), null, 2));

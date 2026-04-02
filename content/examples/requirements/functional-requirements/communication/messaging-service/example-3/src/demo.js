function detectMessagingFailures(cases) {
  return cases.map((entry) => ({
    event: entry.event,
    suppressDuplicateFanout: entry.sameMessageId && entry.persistedAlready,
    rebuildOffset: entry.offsetGapDetected,
    holdLiveTraffic: entry.replayLagMs > 5000 && entry.sharedPartition
  }));
}

console.log(JSON.stringify(detectMessagingFailures([
  { event: "chat-send", sameMessageId: false, persistedAlready: false, offsetGapDetected: false, replayLagMs: 100, sharedPartition: false },
  { event: "incident-update", sameMessageId: true, persistedAlready: true, offsetGapDetected: true, replayLagMs: 8000, sharedPartition: true },
  { event: "repair-replay", sameMessageId: false, persistedAlready: false, offsetGapDetected: true, replayLagMs: 2000, sharedPartition: false }
]), null, 2));

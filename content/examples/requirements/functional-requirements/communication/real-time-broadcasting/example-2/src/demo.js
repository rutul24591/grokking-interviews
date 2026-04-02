function evaluateBroadcastFanout(cases) {
  return cases.map((entry) => ({
    stream: entry.stream,
    lane: entry.segmented ? "segmented" : "global",
    preloadBackfill: entry.lateJoiners > 0,
    promoteBackup: entry.primaryHealth < 0.5
  }));
}

console.log(JSON.stringify(evaluateBroadcastFanout([
  { stream: "townhall", segmented: false, lateJoiners: 12, primaryHealth: 0.95 },
  { stream: "ops-brief", segmented: true, lateJoiners: 3, primaryHealth: 0.62 },
  { stream: "launch", segmented: true, lateJoiners: 240, primaryHealth: 0.2 }
]), null, 2));

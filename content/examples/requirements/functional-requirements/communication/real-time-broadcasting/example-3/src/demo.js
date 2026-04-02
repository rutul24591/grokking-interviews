function detectBroadcastFailures(cases) {
  return cases.map((entry) => ({
    stream: entry.stream,
    preserveSequenceOnFailover: entry.backupInSync,
    queueCatchUpBuffer: entry.lateJoiners > 0 && entry.bufferMissing,
    switchToRecoveryPage: entry.primaryDropped && !entry.backupAvailable
  }));
}

console.log(JSON.stringify(detectBroadcastFailures([
  { stream: "townhall", backupInSync: true, lateJoiners: 0, bufferMissing: false, primaryDropped: false, backupAvailable: true },
  { stream: "ops-brief", backupInSync: false, lateJoiners: 14, bufferMissing: true, primaryDropped: true, backupAvailable: true },
  { stream: "launch", backupInSync: false, lateJoiners: 400, bufferMissing: true, primaryDropped: true, backupAvailable: false }
]), null, 2));

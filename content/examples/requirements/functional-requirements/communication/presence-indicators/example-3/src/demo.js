function detectPresenceFailures(cases) {
  return cases.map((entry) => ({
    user: entry.user,
    clearGhostState: entry.socketClosed && entry.presenceStillActive,
    rebuildPresenceClock: entry.lastSeenMovedBackward,
    showDisconnectFallback: entry.nodePartitioned && entry.presenceStillActive
  }));
}

console.log(JSON.stringify(detectPresenceFailures([
  { user: "alice", socketClosed: false, presenceStillActive: false, lastSeenMovedBackward: false, nodePartitioned: false },
  { user: "bob", socketClosed: true, presenceStillActive: true, lastSeenMovedBackward: true, nodePartitioned: false },
  { user: "carol", socketClosed: false, presenceStillActive: true, lastSeenMovedBackward: false, nodePartitioned: true }
]), null, 2));

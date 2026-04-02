function evaluatePresenceState(cases) {
  return cases.map((entry) => ({
    user: entry.user,
    derivedState: entry.lastHeartbeatSec < 30 ? "active" : entry.lastHeartbeatSec < 180 ? "idle" : "offline",
    shouldShowLastSeen: entry.lastHeartbeatSec >= 30,
    forceReconnectCheck: entry.connectionMuted && entry.lastHeartbeatSec >= 180
  }));
}

console.log(JSON.stringify(evaluatePresenceState([
  { user: "alice", lastHeartbeatSec: 12, connectionMuted: false },
  { user: "bob", lastHeartbeatSec: 120, connectionMuted: false },
  { user: "carol", lastHeartbeatSec: 360, connectionMuted: true }
]), null, 2));

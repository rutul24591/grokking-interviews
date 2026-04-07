function chooseBroadcastLeaderPlan(room) {
  const actions = [];
  if (!room.visibleLeaderPresent) actions.push("promote-next-visible-tab");
  if (room.unsentEvents > 0) actions.push("replay-unsent-events-once");
  if (room.heartbeatGapSeconds > 8) actions.push("quarantine-stale-tab");
  return {
    id: room.id,
    actions,
    writeAuthority: room.visibleLeaderPresent ? room.currentLeader : room.nextVisibleTab,
    shipReady: !actions.includes("quarantine-stale-tab") || room.snapshotReplayReady
  };
}

const rooms = [
  { id: "healthy", visibleLeaderPresent: true, unsentEvents: 0, heartbeatGapSeconds: 0, currentLeader: "tab-a", nextVisibleTab: "tab-b", snapshotReplayReady: true },
  { id: "handoff", visibleLeaderPresent: false, unsentEvents: 2, heartbeatGapSeconds: 3, currentLeader: "tab-a", nextVisibleTab: "tab-b", snapshotReplayReady: true },
  { id: "split", visibleLeaderPresent: true, unsentEvents: 1, heartbeatGapSeconds: 12, currentLeader: "tab-c", nextVisibleTab: "tab-d", snapshotReplayReady: false }
];

console.log(rooms.map(chooseBroadcastLeaderPlan));

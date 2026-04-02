function detectWebSocketFailures(cases) {
  return cases.map((entry) => ({
    connection: entry.connection,
    terminateGhostSocket: entry.noHeartbeat && entry.serverStillTracksRoom,
    staggerReconnect: entry.reconnectBurst > entry.allowedBurst,
    rebuildRoomMembership: entry.nodeFailover && entry.membershipCacheStale
  }));
}

console.log(JSON.stringify(detectWebSocketFailures([
  { connection: "c1", noHeartbeat: false, serverStillTracksRoom: false, reconnectBurst: 2, allowedBurst: 10, nodeFailover: false, membershipCacheStale: false },
  { connection: "c2", noHeartbeat: true, serverStillTracksRoom: true, reconnectBurst: 18, allowedBurst: 6, nodeFailover: true, membershipCacheStale: true },
  { connection: "c3", noHeartbeat: true, serverStillTracksRoom: false, reconnectBurst: 4, allowedBurst: 4, nodeFailover: false, membershipCacheStale: false }
]), null, 2));

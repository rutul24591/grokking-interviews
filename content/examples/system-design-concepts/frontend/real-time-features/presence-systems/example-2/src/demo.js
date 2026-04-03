function derivePresencePlan(room) {
  return {
    id: room.id,
    degradePresence: room.heartbeatSeconds > 30 || room.syncState === "lagging",
    cleanupStaleUsers: room.staleUsers > 0,
    awayThresholdMode: room.activeUsers > 5 ? "lenient" : "standard",
    blockHandoff: room.syncState === "repair" || room.staleUsers > 2
  };
}

const rooms = [
  { id: "healthy", heartbeatSeconds: 15, syncState: "healthy", staleUsers: 1, activeUsers: 6 },
  { id: "lagging", heartbeatSeconds: 25, syncState: "lagging", staleUsers: 2, activeUsers: 3 },
  { id: "repair", heartbeatSeconds: 40, syncState: "repair", staleUsers: 5, activeUsers: 2 }
];

const plans = rooms.map(derivePresencePlan);
console.log(plans);
console.log({ blockedHandoffs: plans.filter((plan) => plan.blockHandoff).length });

function chooseVoteWriteBehavior(requests) {
  return requests.map((request) => ({
    id: request.id,
    optimistic: request.networkHealthy,
    idempotencyKey: `${request.userId}:${request.entityId}`,
    collapseRapidToggles: request.surface === "feed" || request.toggleBurst > 1
  }));
}

console.log(chooseVoteWriteBehavior([
  { id: "uv-1", networkHealthy: true, userId: "u1", entityId: "post-1", surface: "feed", toggleBurst: 2 },
  { id: "uv-2", networkHealthy: false, userId: "u2", entityId: "post-2", surface: "detail", toggleBurst: 1 }
]));

function detectEventStreamEdgeCases(events) {
  const outOfOrder = events.filter((event, index) => index > 0 && event.sequence < events[index - 1].sequence).map((event) => event.id);
  const duplicates = events.filter((event, index) => events.findIndex((candidate) => candidate.idempotencyKey === event.idempotencyKey) !== index).map((event) => event.id);
  return {
    outOfOrder,
    duplicates,
    freezeProjectionWrites: outOfOrder.length > 0,
    suppressReplayDuplicates: duplicates.length > 0
  };
}

console.log(detectEventStreamEdgeCases([
  { id: "ev-1", sequence: 1, idempotencyKey: "k1" },
  { id: "ev-2", sequence: 3, idempotencyKey: "k2" },
  { id: "ev-3", sequence: 2, idempotencyKey: "k2" }
]));

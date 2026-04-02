function chooseTrackingPath(events) {
  return events.map((event) => ({
    id: event.id,
    path: event.highValue ? "sync-write" : event.offline ? "local-buffer" : "batch-pipeline",
    dedupeKey: `${event.userId}:${event.event}:${event.entityId}`,
    emitReceipt: event.highValue || event.complianceScoped
  }));
}

console.log(chooseTrackingPath([
  { id: "et-1", highValue: false, offline: true, userId: "u1", event: "like", entityId: "post-1", complianceScoped: false },
  { id: "et-2", highValue: true, offline: false, userId: "u2", event: "share", entityId: "post-9", complianceScoped: true }
]));

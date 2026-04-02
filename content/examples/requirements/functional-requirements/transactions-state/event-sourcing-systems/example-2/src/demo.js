function chooseProjectionPlan(streams) {
  return streams.map((stream) => ({
    id: stream.id,
    snapshotNow: stream.eventCount > stream.snapshotThreshold,
    replayFromStart: stream.snapshotMissing,
    rebuildReadModel: stream.readModelLag > 0
  }));
}

console.log(chooseProjectionPlan([
  { id: "ord-100", eventCount: 140, snapshotThreshold: 100, snapshotMissing: false, readModelLag: 2 },
  { id: "ord-101", eventCount: 12, snapshotThreshold: 100, snapshotMissing: true, readModelLag: 0 }
]));

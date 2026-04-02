function detectGroupRoomFailures(cases) {
  return cases.map((entry) => ({
    room: entry.room,
    showRemovedState: entry.removedAfterJoin,
    rebuildRoster: entry.rosterVersionMismatch,
    blockComposer: entry.roomArchived || entry.roomDeleted
  }));
}

console.log(JSON.stringify(detectGroupRoomFailures([
  { room: "community", removedAfterJoin: false, rosterVersionMismatch: false, roomArchived: false, roomDeleted: false },
  { room: "incident", removedAfterJoin: true, rosterVersionMismatch: true, roomArchived: false, roomDeleted: false },
  { room: "archive", removedAfterJoin: false, rosterVersionMismatch: false, roomArchived: true, roomDeleted: true }
]), null, 2));

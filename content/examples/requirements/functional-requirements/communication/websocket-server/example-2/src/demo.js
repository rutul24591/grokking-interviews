function evaluateWebSocketAdmission(cases) {
  return cases.map((entry) => ({
    connection: entry.connection,
    admit: entry.authenticated && entry.roomCount <= entry.maxRooms,
    requireBackoff: entry.currentLoad > entry.capacity * 0.9,
    dropToReadOnly: entry.authenticated && entry.currentLoad > entry.capacity
  }));
}

console.log(JSON.stringify(evaluateWebSocketAdmission([
  { connection: "c1", authenticated: true, roomCount: 2, maxRooms: 5, currentLoad: 40, capacity: 100 },
  { connection: "c2", authenticated: true, roomCount: 8, maxRooms: 5, currentLoad: 92, capacity: 100 },
  { connection: "c3", authenticated: false, roomCount: 1, maxRooms: 5, currentLoad: 110, capacity: 100 }
]), null, 2));

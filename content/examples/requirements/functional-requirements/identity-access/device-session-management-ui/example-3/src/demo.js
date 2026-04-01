function reviewNeeded(session, trustedLocations) {
  return {
    id: session.id,
    unfamiliarLocation: !trustedLocations.includes(session.location),
    stale: session.lastSeenDays > 30,
  };
}

console.log(reviewNeeded({ id: 'sess-2', location: 'Paris', lastSeenDays: 2 }, ['Bengaluru', 'Mumbai']));

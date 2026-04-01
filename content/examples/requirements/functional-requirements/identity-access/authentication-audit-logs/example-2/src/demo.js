function retained(events, cutoffIso) {
  const cutoff = new Date(cutoffIso).getTime();
  return events.filter((event) => new Date(event.timestamp).getTime() >= cutoff);
}

console.log(retained([
  { id: 'evt-1', timestamp: '2026-04-01T10:00:00Z' },
  { id: 'evt-2', timestamp: '2026-03-01T10:00:00Z' }
], '2026-03-15T00:00:00Z'));

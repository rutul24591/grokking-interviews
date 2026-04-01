function suppressDuplicate(events, nextEvent) {
  const duplicate = events.find(
    (event) =>
      event.channel === nextEvent.channel &&
      event.message === nextEvent.message &&
      nextEvent.timestamp - event.timestamp <= event.dedupeWindowMs
  );

  return duplicate ? { action: "drop-duplicate", duplicateOf: duplicate.id } : { action: "capture" };
}

console.log(
  suppressDuplicate(
    [{ id: "g1", channel: "window.onerror", message: "widget failed", timestamp: 1_000, dedupeWindowMs: 5_000 }],
    { channel: "window.onerror", message: "widget failed", timestamp: 4_000 }
  )
);

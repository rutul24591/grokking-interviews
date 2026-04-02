function detectTrackingLoss(events) {
  const dropped = events.filter((event) => event.acked === false && event.retries > event.retryBudget).map((event) => event.id);
  const duplicates = events.filter((event) => event.deliveryCount > 1).map((event) => event.id);
  return {
    dropped,
    duplicates,
    triggerReplay: dropped.length > 0,
    dedupeOnRecovery: duplicates.length > 0
  };
}

console.log(detectTrackingLoss([
  { id: "et-9", acked: false, retries: 4, retryBudget: 3, deliveryCount: 1 },
  { id: "et-10", acked: true, retries: 1, retryBudget: 3, deliveryCount: 2 }
]));

function evaluateBookingHolds(holds) {
  return holds.map((hold) => ({
    id: hold.id,
    canConfirm: hold.inventoryRemaining > 0 && hold.minutesRemaining > 0,
    releaseHold: hold.minutesRemaining <= 0,
    requireManualCheck: hold.inventoryRemaining === 0 && hold.overrideRequested
  }));
}

console.log(evaluateBookingHolds([
  { id: "bk-1", inventoryRemaining: 2, minutesRemaining: 5, overrideRequested: false },
  { id: "bk-2", inventoryRemaining: 0, minutesRemaining: -1, overrideRequested: true }
]));

function evaluateConflictResolution(writes) {
  return writes.map((entry) => ({
    requestId: entry.requestId,
    acceptMerge: entry.sameFieldTouched === false && !entry.versionGapLarge,
    retryWithFreshRead: entry.transientConflict && entry.retryBudgetRemaining > 0,
    manualAdjudication: entry.sameFieldTouched || entry.idempotencyMismatch
  }));
}

console.log(JSON.stringify(evaluateConflictResolution([
  {
    "requestId": "cr-1",
    "sameFieldTouched": false,
    "versionGapLarge": false,
    "transientConflict": false,
    "retryBudgetRemaining": 0,
    "idempotencyMismatch": false
  },
  {
    "requestId": "cr-2",
    "sameFieldTouched": false,
    "versionGapLarge": true,
    "transientConflict": true,
    "retryBudgetRemaining": 2,
    "idempotencyMismatch": false
  },
  {
    "requestId": "cr-3",
    "sameFieldTouched": true,
    "versionGapLarge": false,
    "transientConflict": false,
    "retryBudgetRemaining": 0,
    "idempotencyMismatch": true
  }
]), null, 2));

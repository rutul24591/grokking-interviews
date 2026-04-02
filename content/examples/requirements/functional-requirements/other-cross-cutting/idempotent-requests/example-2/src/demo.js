function evaluateIdempotentRequests(requests) {
  return requests.map((entry) => ({
    requestId: entry.requestId,
    safeToReplay: entry.keyPresent && entry.scopeMatches && entry.outcomeFinalized,
    rejectWrongScope: entry.keyPresent && !entry.scopeMatches,
    deferUntilOutcomeFinal: entry.keyPresent && !entry.outcomeFinalized
  }));
}

console.log(JSON.stringify(evaluateIdempotentRequests([
  {
    "requestId": "id-1",
    "keyPresent": true,
    "scopeMatches": true,
    "outcomeFinalized": true
  },
  {
    "requestId": "id-2",
    "keyPresent": true,
    "scopeMatches": false,
    "outcomeFinalized": true
  },
  {
    "requestId": "id-3",
    "keyPresent": true,
    "scopeMatches": true,
    "outcomeFinalized": false
  }
]), null, 2));

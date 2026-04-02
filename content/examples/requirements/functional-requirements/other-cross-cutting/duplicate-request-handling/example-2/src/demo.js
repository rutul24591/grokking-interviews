function evaluateDuplicateRequests(requests) {
  return requests.map((entry) => ({
    requestId: entry.requestId,
    replayPriorResult: entry.idempotencyKeySeen && entry.priorSideEffectsComplete,
    queueFreshExecution: !entry.idempotencyKeySeen,
    manualReview: entry.idempotencyKeySeen && !entry.priorSideEffectsComplete
  }));
}

console.log(JSON.stringify(evaluateDuplicateRequests([
  {
    "requestId": "dr-1",
    "idempotencyKeySeen": true,
    "priorSideEffectsComplete": true
  },
  {
    "requestId": "dr-2",
    "idempotencyKeySeen": false,
    "priorSideEffectsComplete": false
  },
  {
    "requestId": "dr-3",
    "idempotencyKeySeen": true,
    "priorSideEffectsComplete": false
  }
]), null, 2));

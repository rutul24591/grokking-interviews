function evaluateRetryMechanisms(attempts) {
  return attempts.map((entry) => ({
    attemptId: entry.attemptId,
    scheduleRetry: entry.transientFailure && entry.retryCount < entry.retryBudget && !entry.idempotencyUnknown,
    sendToDeadLetter: entry.retryCount >= entry.retryBudget || entry.permanentFailure,
    requireOutcomeCheck: entry.idempotencyUnknown || entry.remoteCommitAmbiguous
  }));
}

console.log(JSON.stringify(evaluateRetryMechanisms([
  {
    "attemptId": "rt-1",
    "transientFailure": true,
    "retryCount": 1,
    "retryBudget": 4,
    "idempotencyUnknown": false,
    "permanentFailure": false,
    "remoteCommitAmbiguous": false
  },
  {
    "attemptId": "rt-2",
    "transientFailure": true,
    "retryCount": 4,
    "retryBudget": 4,
    "idempotencyUnknown": false,
    "permanentFailure": false,
    "remoteCommitAmbiguous": false
  },
  {
    "attemptId": "rt-3",
    "transientFailure": false,
    "retryCount": 1,
    "retryBudget": 4,
    "idempotencyUnknown": true,
    "permanentFailure": true,
    "remoteCommitAmbiguous": true
  }
]), null, 2));

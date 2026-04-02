function planIdempotencyHandling(requests) {
  return requests.map((request) => ({
    id: request.id,
    accept: request.keyPresent && request.scopeMatches,
    reuseStoredResponse: request.keySeenBefore,
    rejectUnsafeRetry: !request.keyPresent || !request.scopeMatches
  }));
}

console.log(planIdempotencyHandling([
  { id: "req-1", keyPresent: true, scopeMatches: true, keySeenBefore: false },
  { id: "req-2", keyPresent: true, scopeMatches: true, keySeenBefore: true }
]));

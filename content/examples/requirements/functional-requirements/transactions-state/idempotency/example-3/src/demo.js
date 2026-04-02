function detectIdempotencyEdgeCases(requests) {
  const scopeMismatch = requests.filter((request) => request.keySeenBefore && !request.scopeMatches).map((request) => request.id);
  const expiredKeys = requests.filter((request) => request.keyExpired).map((request) => request.id);
  return {
    scopeMismatch,
    expiredKeys,
    blockReplay: scopeMismatch.length > 0,
    forceNewWritePath: expiredKeys.length > 0
  };
}

console.log(detectIdempotencyEdgeCases([
  { id: "req-1", keySeenBefore: true, scopeMatches: false, keyExpired: false },
  { id: "req-2", keySeenBefore: false, scopeMatches: true, keyExpired: true }
]));

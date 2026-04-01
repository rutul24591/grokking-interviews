function validateMfaWindow({ driftSeconds, ttlSeconds, attemptsRemaining }) {
  const withinWindow = Math.abs(driftSeconds) <= ttlSeconds;
  return {
    accepted: withinWindow && attemptsRemaining > 0,
    withinWindow,
    attemptsRemaining
  };
}

console.log(validateMfaWindow({ driftSeconds: 12, ttlSeconds: 30, attemptsRemaining: 2 }));
console.log(validateMfaWindow({ driftSeconds: 44, ttlSeconds: 30, attemptsRemaining: 2 }));

type ChargeAttempt = { idempotencyKey: string; bodyHashMatches: boolean; replayWindowMinutes: number };

function classifyReplay(attempt: ChargeAttempt) {
  const conflict = !attempt.bodyHashMatches;
  return {
    key: attempt.idempotencyKey,
    conflict,
    action: conflict ? 'reject-key-reuse-with-different-body' : attempt.replayWindowMinutes > 10 ? 'expire-and-reissue-key' : 'return-original-response',
  };
}

const results = [
  { idempotencyKey: 'k-1', bodyHashMatches: true, replayWindowMinutes: 3 },
  { idempotencyKey: 'k-1', bodyHashMatches: false, replayWindowMinutes: 3 },
].map(classifyReplay);

console.table(results);
if (results[1].action !== 'reject-key-reuse-with-different-body') throw new Error('Body mismatch should be rejected');

type Gap = { missingSeq: number; sinceMs: number };

function shouldDeadLetter(gap: Gap, nowMs: number, timeoutMs: number) {
  return nowMs - gap.sinceMs >= timeoutMs;
}

const gap: Gap = { missingSeq: 42, sinceMs: Date.now() - 10_000 };
console.log(JSON.stringify({ deadLetter: shouldDeadLetter(gap, Date.now(), 5_000), gap }, null, 2));


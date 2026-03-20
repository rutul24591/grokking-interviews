type Attempt = { n: number; waitMs: number; ok: boolean };

async function retryWithBudget(opts: { maxAttempts: number; baseDelayMs: number; jitter: number }, fn: () => Promise<boolean>) {
  const attempts: Attempt[] = [];
  for (let n = 1; n <= opts.maxAttempts; n++) {
    const ok = await fn();
    attempts.push({ n, waitMs: 0, ok });
    if (ok) return { ok: true, attempts };
    if (n === opts.maxAttempts) break;
    const backoff = opts.baseDelayMs * 2 ** (n - 1);
    const jitter = Math.floor(backoff * opts.jitter * Math.random());
    const waitMs = backoff + jitter;
    attempts[attempts.length - 1] = { n, waitMs, ok: false };
    await new Promise((r) => setTimeout(r, waitMs));
  }
  return { ok: false, attempts };
}

let failuresLeft = 2;
async function flaky() {
  if (failuresLeft-- > 0) return false;
  return true;
}

const out = await retryWithBudget({ maxAttempts: 4, baseDelayMs: 60, jitter: 0.3 }, flaky);

console.log(
  JSON.stringify(
    {
      out,
      guidance: [
        "Use a retry budget: retries must be bounded and visible (metrics).",
        "Backoff + jitter prevents synchronized retry storms.",
        "Retries should be conditional (idempotent, safe endpoints only).",
      ],
    },
    null,
    2,
  ),
);


export type RetryPolicy = {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitterPct: number; // 0..1
};

export function backoffDelayMs(policy: RetryPolicy, attempt: number): number {
  const exp = Math.min(policy.maxDelayMs, policy.baseDelayMs * 2 ** (attempt - 1));
  const jitter = exp * policy.jitterPct * Math.random();
  return Math.floor(exp + jitter);
}

export async function withRetry<T>(params: {
  policy: RetryPolicy;
  fn: (attempt: number) => Promise<T>;
  retryable: (e: unknown) => boolean;
}): Promise<{ value: T; attempts: number }> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= params.policy.maxAttempts; attempt++) {
    try {
      const value = await params.fn(attempt);
      return { value, attempts: attempt };
    } catch (e) {
      lastErr = e;
      if (attempt === params.policy.maxAttempts || !params.retryable(e)) break;
      const d = backoffDelayMs(params.policy, attempt);
      await new Promise((r) => setTimeout(r, d));
    }
  }
  throw lastErr;
}


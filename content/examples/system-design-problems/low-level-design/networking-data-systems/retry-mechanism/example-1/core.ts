export type RetryPolicy = {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  retryable: (e: unknown) => boolean;
};

export function jitterBackoffMs(attempt: number, baseMs: number, maxMs: number) {
  const exp = Math.min(maxMs, baseMs * 2 ** Math.max(0, attempt - 1));
  const jitter = Math.random() * exp * 0.2;
  return Math.floor(exp + jitter);
}

export async function retry<T>(fn: () => Promise<T>, policy: RetryPolicy): Promise<T> {
  let lastErr: unknown = null;
  for (let attempt = 1; attempt <= policy.maxAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (!policy.retryable(e) || attempt === policy.maxAttempts) break;
      await new Promise((r) => setTimeout(r, jitterBackoffMs(attempt, policy.baseDelayMs, policy.maxDelayMs)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("retry failed");
}

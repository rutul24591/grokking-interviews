import { backoffDelayMs, sleep } from "@/lib/backoff";

export async function fetchJsonWithRetry<T>(
  url: string,
  opts: {
    signal?: AbortSignal;
    maxAttempts: number;
    baseDelayMs: number;
  },
) {
  let lastError: unknown = undefined;
  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      const res = await fetch(url, { signal: opts.signal });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        const err = new Error(`HTTP ${res.status}${txt ? ` — ${txt}` : ""}`);
        // Retry only transient server failure classes.
        if (attempt < opts.maxAttempts && (res.status === 429 || res.status >= 500)) {
          await sleep(backoffDelayMs(opts.baseDelayMs, attempt), opts.signal);
          continue;
        }
        throw err;
      }
      return (await res.json()) as T;
    } catch (e) {
      if (opts.signal?.aborted) throw e;
      lastError = e;
      if (attempt < opts.maxAttempts) {
        await sleep(backoffDelayMs(opts.baseDelayMs, attempt), opts.signal);
        continue;
      }
      throw lastError;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Request failed");
}


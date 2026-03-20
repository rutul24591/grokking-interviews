type RetryOptions = {
  maxAttempts: number;
  baseDelayMs: number;
};

type CacheOptions = {
  ttlMs: number;
};

type FetchJsonOptions = {
  signal?: AbortSignal;
  retry?: RetryOptions;
  cache?: CacheOptions;
};

type CacheEntry = {
  expiresAt: number;
  value: unknown;
};

const memoryCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetriableStatus(status: number) {
  // Common retriable classes: 429/5xx. This is simplistic but practical.
  return status === 429 || (status >= 500 && status <= 599);
}

export async function fetchJson<T>(url: string, options: FetchJsonOptions = {}) {
  const now = Date.now();
  const cacheTtlMs = options.cache?.ttlMs ?? 0;
  const cached = cacheTtlMs ? memoryCache.get(url) : undefined;
  if (cached && cached.expiresAt > now) {
    return cached.value as T;
  }

  const existing = inflight.get(url);
  if (existing) return existing as Promise<T>;

  const promise = (async () => {
    const retry = options.retry ?? { maxAttempts: 1, baseDelayMs: 0 };
    let lastError: unknown = undefined;

    for (let attempt = 1; attempt <= retry.maxAttempts; attempt++) {
      try {
        const res = await fetch(url, { signal: options.signal });
        if (!res.ok) {
          const body = await res.text().catch(() => "");
          const message = `HTTP ${res.status} ${res.statusText}${body ? ` — ${body}` : ""}`;
          if (attempt < retry.maxAttempts && isRetriableStatus(res.status)) {
            await sleep(retry.baseDelayMs * Math.pow(2, attempt - 1));
            continue;
          }
          throw new Error(message);
        }

        const data = (await res.json()) as T;
        if (cacheTtlMs) {
          memoryCache.set(url, { value: data, expiresAt: Date.now() + cacheTtlMs });
        }
        return data;
      } catch (err) {
        if (options.signal?.aborted) throw err;
        lastError = err;
        if (attempt < retry.maxAttempts) {
          await sleep(retry.baseDelayMs * Math.pow(2, attempt - 1));
          continue;
        }
        throw lastError;
      }
    }

    throw lastError instanceof Error ? lastError : new Error("Request failed");
  })();

  inflight.set(url, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(url);
  }
}


/**
 * Async Validation Deduplication — Prevents redundant API calls for the same validation.
 *
 * Interview edge case: User types "john" → API call to check username availability.
 * User deletes to "joh" → types "n" again → "john" → should NOT make a second API call.
 * Solution: cache validation results with TTL.
 */

interface CacheEntry {
  result: string | null; // error message or null if valid
  timestamp: number;
}

/**
 * Debounced async validator with result caching and TTL.
 */
export function createAsyncValidator<T = unknown>(
  validateFn: (value: T) => Promise<string | null>,
  options: { debounceMs?: number; cacheTTL?: number } = {},
) {
  const { debounceMs = 300, cacheTTL = 60000 } = options;
  const cache = new Map<string, CacheEntry>();
  const pendingRequests = new Map<string, Promise<string | null>>();
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Returns cached result if available and not expired, otherwise validates.
   */
  async function validate(value: T): Promise<string | null> {
    const key = JSON.stringify(value);
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < cacheTTL) {
      return cached.result;
    }

    // Return pending request if already in flight
    const pending = pendingRequests.get(key);
    if (pending) return pending;

    const promise = validateFn(value);
    pendingRequests.set(key, promise);

    try {
      const result = await promise;
      cache.set(key, { result, timestamp: Date.now() });
      return result;
    } finally {
      pendingRequests.delete(key);
    }
  }

  /**
   * Debounced version — delays validation until user stops typing.
   */
  function debouncedValidate(value: T): Promise<string | null> {
    return new Promise((resolve) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(async () => {
        const result = await validate(value);
        resolve(result);
      }, debounceMs);
    });
  }

  return { validate, debouncedValidate, clearCache: () => cache.clear() };
}

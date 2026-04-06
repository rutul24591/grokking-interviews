import type { ValidationError, AsyncValidatorFn } from "./validation-types";

// ─── Async Validator Configuration ───────────────────────────────────

interface AsyncValidatorConfig {
  checkFn: AsyncValidatorFn;
  debounceMs: number;
  cacheMaxSize: number;
}

// ─── LRU Cache for Deduplication ─────────────────────────────────────

class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Evict least recently used (first entry)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// ─── Async Validator Factory ─────────────────────────────────────────

export interface AsyncValidatorInstance {
  validate: (
    value: unknown,
    onResult: (error: ValidationError | null) => void
  ) => void;
  cancel: () => void;
  clearCache: () => void;
  getCacheSize: () => number;
}

export function createAsyncValidator(
  config: AsyncValidatorConfig
): AsyncValidatorInstance {
  const { checkFn, debounceMs, cacheMaxSize } = config;
  const cache = new LRUCache<string, ValidationError | null>(cacheMaxSize);

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let activeController: AbortController | null = null;
  let currentValue: unknown = undefined;

  function cancel(): void {
    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    if (activeController !== null) {
      activeController.abort();
      activeController = null;
    }
  }

  function validate(
    value: unknown,
    onResult: (error: ValidationError | null) => void
  ): void {
    currentValue = value;

    // Check cache first for deduplication
    const cacheKey = String(value);
    const cachedResult = cache.get(cacheKey);
    if (cachedResult !== undefined) {
      onResult(cachedResult);
      return;
    }

    // Cancel any in-flight request
    cancel();

    // Start debounce timer
    debounceTimer = setTimeout(() => {
      debounceTimer = null;

      // Create new AbortController for this request
      const controller = new AbortController();
      activeController = controller;

      checkFn(value, controller.signal)
        .then((error) => {
          // Only apply result if this request was not aborted
          if (!controller.signal.aborted) {
            cache.set(cacheKey, error);
            onResult(error);
          }
        })
        .catch((err) => {
          // AbortError is expected and should be silently ignored
          if (err instanceof DOMException && err.name === "AbortError") {
            return;
          }
          // Network error or other failure
          if (!controller.signal.aborted) {
            const networkError: ValidationError = {
              code: "async_error",
              messageKey: "validation.asyncError",
              retryable: true,
            };
            onResult(networkError);
          }
        })
        .finally(() => {
          if (activeController === controller) {
            activeController = null;
          }
        });
    }, debounceMs);
  }

  function clearCache(): void {
    cache.clear();
  }

  function getCacheSize(): number {
    // LRU cache size tracking; in production use a Map with size property
    return 0;
  }

  return {
    validate,
    cancel,
    clearCache,
    getCacheSize,
  };
}

// ─── Debounce Helper (for use outside the factory) ───────────────────

export function debounceAsync<T extends (...args: never[]) => Promise<unknown>>(
  fn: T,
  delayMs: number
): {
  debounced: (...args: Parameters<T>) => Promise<ReturnType<T>>;
  cancel: () => void;
} {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let controller: AbortController | null = null;
  let resolveRef: ((value: ReturnType<T>) => void) | null = null;
  let rejectRef: ((reason?: unknown) => void) | null = null;

  function cancel() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    if (controller !== null) {
      controller.abort();
      controller = null;
    }
  }

  function debounced(
    ...args: Parameters<T>
  ): Promise<ReturnType<T>> {
    cancel();

    return new Promise<ReturnType<T>>((resolve, reject) => {
      resolveRef = resolve;
      rejectRef = reject;

      controller = new AbortController();
      const localController = controller;

      timer = setTimeout(async () => {
        timer = null;
        try {
          const result = (await fn(...args)) as ReturnType<T>;
          if (!localController.signal.aborted && resolveRef) {
            resolveRef(result);
          }
        } catch (err) {
          if (
            err instanceof DOMException &&
            err.name === "AbortError"
          ) {
            return;
          }
          if (!localController.signal.aborted && rejectRef) {
            rejectRef(err);
          }
        }
      }, delayMs);
    });
  }

  return { debounced, cancel };
}

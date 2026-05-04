export function createIdempotencyGuard() {
  let inFlight: Promise<unknown> | null = null;
  return async function guarded<T>(fn: () => Promise<T>): Promise<T> {
    if (inFlight) return inFlight as Promise<T>;
    inFlight = fn().finally(() => {
      inFlight = null;
    });
    return inFlight as Promise<T>;
  };
}


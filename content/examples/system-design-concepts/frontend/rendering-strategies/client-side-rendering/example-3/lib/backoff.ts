export async function sleep(ms: number, signal?: AbortSignal) {
  if (!signal) return new Promise((r) => setTimeout(r, ms));
  return new Promise<void>((resolve, reject) => {
    const id = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    }
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

export function backoffDelayMs(baseMs: number, attempt: number) {
  const pow = Math.pow(2, attempt - 1);
  const jitter = 0.7 + Math.random() * 0.6;
  return Math.round(baseMs * pow * jitter);
}


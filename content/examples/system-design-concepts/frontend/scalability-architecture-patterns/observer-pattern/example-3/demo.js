function createObservable(initial) {
  let value = initial;
  const listeners = new Set();
  return {
    get: () => value,
    set: (next) => {
      value = next;
      for (const l of listeners) l();
    },
    subscribe: (listener, opts) => {
      listeners.add(listener);
      if (opts?.signal) {
        if (opts.signal.aborted) listeners.delete(listener);
        opts.signal.addEventListener("abort", () => listeners.delete(listener), { once: true });
      }
      return () => listeners.delete(listener);
    },
    size: () => listeners.size
  };
}

const obs = createObservable(0);

// Simulate creating/destroying 10k “components”.
for (let i = 0; i < 10_000; i += 1) {
  const controller = new AbortController();
  const big = Buffer.alloc(50_000); // big capture
  obs.subscribe(() => big[0], { signal: controller.signal });
  controller.abort(); // cleanup
}

process.stdout.write(`listeners after cleanup: ${obs.size()}\n`);

// Now “leak”: forget to abort/unsubscribe.
for (let i = 0; i < 10_000; i += 1) {
  const big = Buffer.alloc(50_000);
  obs.subscribe(() => big[0]);
}

process.stdout.write(`listeners after leak: ${obs.size()}\n`);


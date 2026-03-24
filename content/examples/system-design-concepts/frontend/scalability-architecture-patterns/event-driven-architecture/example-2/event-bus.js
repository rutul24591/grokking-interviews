export function createAsyncEventBus({ capacity, concurrency }) {
  /** @type {Array<{type: string, payload: any}>} */
  const queue = [];
  /** @type {Map<string, Set<(payload:any)=>Promise<void>|void>>} */
  const handlers = new Map();

  let running = 0;
  let dropped = 0;

  function on(type, handler) {
    if (!handlers.has(type)) handlers.set(type, new Set());
    handlers.get(type).add(handler);
    return () => handlers.get(type)?.delete(handler);
  }

  function emit(type, payload) {
    if (queue.length >= capacity) {
      dropped += 1;
      return { accepted: false, dropped };
    }
    queue.push({ type, payload });
    drain();
    return { accepted: true, dropped };
  }

  async function runOne(item) {
    const set = handlers.get(item.type);
    if (!set || set.size === 0) return;
    for (const h of set) await h(item.payload);
  }

  function drain() {
    while (running < concurrency && queue.length > 0) {
      const next = queue.shift();
      running += 1;
      runOne(next)
        .catch(() => {})
        .finally(() => {
          running -= 1;
          drain();
        });
    }
  }

  return {
    on,
    emit,
    stats: () => ({ queued: queue.length, running, dropped })
  };
}


export type Unsubscribe = () => void;
export type Listener = () => void;

export type Observable<T> = {
  get: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (listener: Listener) => Unsubscribe;
};

export function createBatchedObservable<T>(initial: T): Observable<T> {
  let value = initial;
  const listeners = new Set<Listener>();

  let scheduled = false;
  function notifyBatched() {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      for (const l of listeners) l();
    });
  }

  return {
    get: () => value,
    set: (next) => {
      const computed = typeof next === "function" ? (next as (p: T) => T)(value) : next;
      if (Object.is(computed, value)) return;
      value = computed;
      notifyBatched();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}


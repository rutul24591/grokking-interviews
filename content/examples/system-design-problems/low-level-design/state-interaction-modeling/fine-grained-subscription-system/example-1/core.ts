export type Unsub = () => void;

export function createSubStore<TState>(initial: TState) {
  let state = initial;
  const listeners = new Set<() => void>();

  return {
    get: () => state,
    set: (next: TState) => {
      state = next;
      for (const l of listeners) l();
    },
    subscribe: (l: () => void): Unsub => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    // interview: add selector-based subscriptions to avoid global re-renders
  };
}

export type Sample = {
  route: string;
  ttfbMs: number;
  longTaskMs: number;
  bytes: number;
  ts: string;
};

export type Budgets = {
  maxP95TtfbMs: number;
  maxP95LongTaskMs: number;
  maxP95Bytes: number;
};

type Store = {
  samples: Sample[];
  budgets: Budgets;
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__PERF_STORE__ as Store | undefined) ?? {
    samples: [],
    budgets: { maxP95TtfbMs: 250, maxP95LongTaskMs: 80, maxP95Bytes: 40_000 },
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__PERF_STORE__ = store;

export function getStore() {
  return store;
}

export function reset() {
  store.samples = [];
}


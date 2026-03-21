export type FlagConfig = {
  key: string;
  enabled: boolean;
  rolloutPct: number;
  killSwitch: boolean;
  salt: string;
};

type Metrics = { exposures: number; errors: number };

type Store = {
  flag: FlagConfig;
  metrics: Metrics;
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__ROLLOUT_STORE__ as Store | undefined) ?? {
    flag: { key: "new-ui", enabled: true, rolloutPct: 10, killSwitch: false, salt: "v1" },
    metrics: { exposures: 0, errors: 0 },
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__ROLLOUT_STORE__ = store;

export function getStore() {
  return store;
}

export function reset() {
  store.metrics = { exposures: 0, errors: 0 };
  store.flag = { key: "new-ui", enabled: true, rolloutPct: 10, killSwitch: false, salt: "v1" };
}


import { CircuitBreaker } from "./breaker";

export type PublishResult = {
  publishedAt: string;
  dependencyWriteId: string;
};

type Store = {
  idempotency: Map<string, { status: "ok" | "error"; result?: PublishResult; error?: string }>;
  dependencyWrites: number;
  breaker: CircuitBreaker;
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__EHR_STORE__ as Store | undefined) ?? {
    idempotency: new Map(),
    dependencyWrites: 0,
    breaker: new CircuitBreaker({ failureThreshold: 4, openForMs: 4000, halfOpenMaxCalls: 2 }),
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__EHR_STORE__ = store;

export function getStore() {
  return store;
}

export function reset() {
  store.idempotency.clear();
  store.dependencyWrites = 0;
  store.breaker = new CircuitBreaker({ failureThreshold: 4, openForMs: 4000, halfOpenMaxCalls: 2 });
}


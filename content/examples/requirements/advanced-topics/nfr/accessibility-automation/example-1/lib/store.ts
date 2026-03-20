import type { AuditSummary } from "./audit";

type BaselineEntry = {
  variantId: string;
  capturedAt: string;
  summary: AuditSummary;
};

type Store = {
  baselineByVariant: Map<string, BaselineEntry>;
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__A11Y_STORE__ as Store | undefined) ?? {
    baselineByVariant: new Map(),
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__A11Y_STORE__ = store;

export function getBaseline(variantId: string): BaselineEntry | undefined {
  return store.baselineByVariant.get(variantId);
}

export function setBaseline(entry: BaselineEntry) {
  store.baselineByVariant.set(entry.variantId, entry);
}

export function listBaselines(): BaselineEntry[] {
  return [...store.baselineByVariant.values()].sort((a, b) =>
    a.variantId.localeCompare(b.variantId),
  );
}


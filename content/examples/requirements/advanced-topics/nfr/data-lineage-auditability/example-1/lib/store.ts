import { Ledger } from "./ledger";
import { LineageGraph } from "./lineage";

type Store = {
  ledger: Ledger;
  lineage: LineageGraph;
  lastRun: { jobRunId: string; jobName: string; ts: string } | null;
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__LINEAGE_STORE__ as Store | undefined) ?? {
    ledger: new Ledger(),
    lineage: new LineageGraph(),
    lastRun: null,
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__LINEAGE_STORE__ = store;

export function getStore(): Store {
  return store;
}


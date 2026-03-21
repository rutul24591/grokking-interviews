import { createHash, randomUUID } from "node:crypto";

export type FeedItem = { id: string; title: string; updatedAt: string };

type TelemetryEvent =
  | { type: "longtask"; durationMs: number; ts: string }
  | { type: "poll"; status: number; bytes: number; ts: string; mode: "naive" | "optimized" };

type Store = {
  feedVersion: number;
  items: FeedItem[];
  telemetry: TelemetryEvent[];
};

const store: Store =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((globalThis as any).__EFF_STORE__ as Store | undefined) ?? {
    feedVersion: 1,
    items: Array.from({ length: 50 }, (_, i) => ({
      id: randomUUID(),
      title: `Item ${i + 1}`,
      updatedAt: new Date().toISOString(),
    })),
    telemetry: [],
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__EFF_STORE__ = store;

export function getStore() {
  return store;
}

export function computeEtag(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 16);
}

export function recordTelemetry(e: TelemetryEvent) {
  store.telemetry.push(e);
  if (store.telemetry.length > 2000) store.telemetry.splice(0, store.telemetry.length - 2000);
}


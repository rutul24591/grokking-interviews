export type Delivery = "queued" | "sent" | "delivered" | "read" | "failed";

export type DeliveryEvent =
  | { kind: "sent"; at: number }
  | { kind: "delivered"; at: number }
  | { kind: "read"; at: number }
  | { kind: "failed"; at: number; reason: string };

export type DeliveryState = { state: Delivery; lastAt: number; reason?: string };

export function reduce(prev: DeliveryState, e: DeliveryEvent): DeliveryState {
  // monotonic progression; ignore out-of-order regressions
  const rank: Record<Delivery, number> = { queued: 0, sent: 1, delivered: 2, read: 3, failed: 99 };
  const next: DeliveryState =
    e.kind === "failed"
      ? { state: "failed", lastAt: e.at, reason: e.reason }
      : { state: e.kind, lastAt: e.at };

  if (prev.state === "failed") return prev;
  if (rank[next.state] < rank[prev.state]) return prev;
  if (next.lastAt < prev.lastAt) return prev;
  return next;
}

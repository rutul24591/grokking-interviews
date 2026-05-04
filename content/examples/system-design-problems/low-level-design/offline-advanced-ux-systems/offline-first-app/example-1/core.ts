export type Op = { id: string; kind: string; payload: Record<string, unknown>; at: number };

export type OfflineQueue = {
  pending: Op[];
  inFlight: Set<string>;
};

export function enqueue(q: OfflineQueue, op: Op) {
  return { ...q, pending: [...q.pending, op] };
}

export function dequeueBatch(q: OfflineQueue, max: number) {
  const batch = q.pending.slice(0, max);
  const rest = q.pending.slice(max);
  const inFlight = new Set(q.inFlight);
  for (const op of batch) inFlight.add(op.id);
  return { next: { pending: rest, inFlight }, batch };
}

export function ack(q: OfflineQueue, opId: string) {
  const inFlight = new Set(q.inFlight);
  inFlight.delete(opId);
  return { ...q, inFlight };
}

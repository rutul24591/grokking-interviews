export type Audit = { id: string; at: number; actorId: string; action: string; entityId?: string };

export function filter(a: Audit[], q: { actorId?: string; entityId?: string }) {
  return a.filter((e) => (q.actorId ? e.actorId === q.actorId : true)).filter((e) => (q.entityId ? e.entityId === q.entityId : true));
}

export type Op = { id: string; formId: string; patch: Record<string, unknown>; at: number };
export type SyncState = { pending: Op[]; lastSyncedAt: number | null };

export function enqueue(state: SyncState, op: Op) {
  return { ...state, pending: [...state.pending, op] };
}

export function drain(state: SyncState, max: number) {
  return { batch: state.pending.slice(0, max), next: { ...state, pending: state.pending.slice(max) } };
}

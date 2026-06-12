export interface Mutation {
  id: string;
  entity: "setting";
  baseVersion: number;
  nextVersion: number;
  scope: string;
  idempotencyKey: string;
  payloadSize: number;
  authorized: boolean;
}
export interface State {
  version: number;
  seen: Set<string>;
  accepted: string[];
}
export function applyMutation(state: State, m: Mutation) {
  if (state.seen.has(m.idempotencyKey))
    return { state, accepted: true, reason: "dedupe" };
  if (!m.authorized) return { state, accepted: false, reason: "unauthorized" };
  if (m.baseVersion !== state.version)
    return { state, accepted: false, reason: "version-conflict" };
  if (m.payloadSize > 256_000)
    return { state, accepted: false, reason: "payload-budget" };
  const seen = new Set(state.seen);
  seen.add(m.idempotencyKey);
  return {
    state: {
      version: m.nextVersion,
      seen,
      accepted: [...state.accepted, m.id],
    },
    accepted: true,
    reason: "commit",
  };
}
export function runMutationScenario() {
  let state: State = { version: 4, seen: new Set(), accepted: [] };
  const first = applyMutation(state, {
    id: "settings-page-system-1",
    entity: "setting",
    baseVersion: 4,
    nextVersion: 5,
    scope: "tenant-a",
    idempotencyKey: "k1",
    payloadSize: 2048,
    authorized: true,
  });
  state = first.state;
  return {
    first,
    duplicate: applyMutation(state, {
      id: "settings-page-system-retry",
      entity: "setting",
      baseVersion: 5,
      nextVersion: 6,
      scope: "tenant-a",
      idempotencyKey: "k1",
      payloadSize: 2048,
      authorized: true,
    }),
    conflict: applyMutation(state, {
      id: "settings-page-system-stale",
      entity: "setting",
      baseVersion: 3,
      nextVersion: 4,
      scope: "tenant-a",
      idempotencyKey: "k2",
      payloadSize: 1024,
      authorized: true,
    }),
    detail:
      "Normalize settings by key with source, effective value, editable value, validation, pending mutation, and revision. Save independent sections separately where possible. Server policy may override user preference; the UI must explain locked values and reconcile stale writes without discarding unrelated edits.",
  };
}

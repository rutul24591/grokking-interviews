export type ClientId = string;
export type OpId = string;

export type TextOp =
  | { kind: "insert"; at: number; text: string }
  | { kind: "delete"; at: number; count: number };

export type OpEnvelope = {
  opId: OpId;
  clientId: ClientId;
  baseVersion: number;
  op: TextOp;
  ts: number;
};

export type DocState = {
  version: number;
  text: string;
  // unacked ops for optimistic UI
  pending: OpEnvelope[];
};

export function apply(text: string, op: TextOp) {
  if (op.kind === "insert") return text.slice(0, op.at) + op.text + text.slice(op.at);
  return text.slice(0, op.at) + text.slice(op.at + op.count);
}

export function localApply(state: DocState, env: OpEnvelope): DocState {
  return { ...state, text: apply(state.text, env.op), pending: [...state.pending, env] };
}

export function ack(state: DocState, opId: OpId, newVersion: number): DocState {
  const pending = state.pending.filter((p) => p.opId !== opId);
  return { ...state, version: Math.max(state.version, newVersion), pending };
}

export function rebaseIncoming(state: DocState, incoming: OpEnvelope): DocState {
  // Simplified: assume server serialized ops; in real systems do OT/CRDT.
  // Interview: discuss transform functions and intent preservation.
  const nextText = apply(state.text, incoming.op);
  return { ...state, text: nextText, version: Math.max(state.version, incoming.baseVersion + 1) };
}

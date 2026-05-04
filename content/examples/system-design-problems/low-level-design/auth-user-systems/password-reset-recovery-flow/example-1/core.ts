export type ResetStage =
  | { kind: "request" }
  | { kind: "emailSent"; email: string }
  | { kind: "verifyToken"; token: string }
  | { kind: "setPassword"; token: string }
  | { kind: "done" }
  | { kind: "error"; message: string };

export type ResetState = { stage: ResetStage; requestId: number };

export function create(): ResetState {
  return { stage: { kind: "request" }, requestId: 0 };
}

export function beginRequest(state: ResetState, email: string) {
  return { ...state, requestId: state.requestId + 1, stage: { kind: "emailSent", email } };
}

export function acceptToken(state: ResetState, token: string) {
  return { ...state, stage: { kind: "verifyToken", token } };
}

export function tokenVerified(state: ResetState) {
  if (state.stage.kind !== "verifyToken") return state;
  return { ...state, stage: { kind: "setPassword", token: state.stage.token } };
}

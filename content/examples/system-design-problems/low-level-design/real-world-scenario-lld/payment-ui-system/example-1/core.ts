export type PaymentState = { status: "idle" | "tokenizing" | "authorizing" | "success" | "error"; requestId: number; error: string | null };

export function start(state: PaymentState) {
  return { ...state, status: "tokenizing", requestId: state.requestId + 1, error: null };
}

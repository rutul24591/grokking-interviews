export type Step = "idle" | "validating" | "submitting" | "success" | "error";

export type WorkflowState = { step: Step; requestId: number; error: string | null };

export function create(): WorkflowState {
  return { step: "idle", requestId: 0, error: null };
}

export async function run(args: {
  state: WorkflowState;
  validate: () => Promise<void>;
  submit: () => Promise<void>;
  onState: (s: WorkflowState) => void;
}) {
  const rid = args.state.requestId + 1;
  let s: WorkflowState = { ...args.state, requestId: rid, step: "validating", error: null };
  args.onState(s);
  try {
    await args.validate();
    s = { ...s, step: "submitting" };
    args.onState(s);
    await args.submit();
    s = { ...s, step: "success" };
    args.onState(s);
  } catch (e) {
    s = { ...s, step: "error", error: e instanceof Error ? e.message : "workflow failed" };
    args.onState(s);
  }
}

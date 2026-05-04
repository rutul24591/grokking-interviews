export type StepStatus = "pending" | "active" | "done" | "error";

export type Step = {
  id: string;
  title: string;
  status: StepStatus;
};

export type FlowState = {
  steps: Step[];
  activeIndex: number;
};

export function setActive(state: FlowState, idx: number) {
  return { ...state, activeIndex: Math.max(0, Math.min(state.steps.length - 1, idx)) };
}

export function markDone(state: FlowState, stepId: string) {
  return {
    ...state,
    steps: state.steps.map((s) => (s.id === stepId ? { ...s, status: "done" } : s)),
  };
}

export function markError(state: FlowState, stepId: string) {
  return {
    ...state,
    steps: state.steps.map((s) => (s.id === stepId ? { ...s, status: "error" } : s)),
  };
}

export type StepId = string;

export type Step<TValues> = {
  id: StepId;
  title: string;
  // Return the next step id (supports branching). Return null to finish.
  next: (values: TValues) => StepId | null;
  // Return the previous step id for back navigation.
  prev?: (values: TValues) => StepId | null;
  // Field-level validation for step gating.
  validate?: (values: TValues) => Record<string, string[]>; // field -> messages
};

export type StepGraph<TValues> = {
  start: StepId;
  steps: Record<StepId, Step<TValues>>;
};

export function assertStepGraph<TValues>(graph: StepGraph<TValues>) {
  if (!graph.steps[graph.start]) throw new Error(`Unknown start step: ${graph.start}`);
  // In production, also detect cycles in `next()` across typical branches.
}


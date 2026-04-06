export interface Step { id: string; title: string; description?: string; isValid?: boolean; isSkipped?: boolean; }
export interface StepperState { steps: Step[]; currentStepId: string; completedIds: Set<string>; }

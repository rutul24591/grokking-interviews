/**
 * Skip Logic Re-evaluation — Re-evaluates downstream conditions when user goes back.
 *
 * Interview edge case: User is at step 4, goes back to step 2, changes answer.
 * Step 3 was previously skipped because step 2 answer was "No". Now step 2 is "Yes",
 * so step 3 should be shown. All downstream skip conditions must be re-evaluated.
 */

export interface StepCondition {
  stepId: string;
  fieldId: string;
  operator: 'eq' | 'neq';
  value: unknown;
}

export interface Step {
  id: string;
  skipIf?: StepCondition[]; // Skip this step if ANY condition matches
}

/**
 * Re-evaluates skip logic for all steps after a changed step.
 * Returns the updated list of visible step IDs.
 */
export function reevaluateSkipLogic(
  steps: Step[],
  values: Record<string, unknown>,
  changedStepId: string,
): string[] {
  const visibleSteps: string[] = [];
  const changedIndex = steps.findIndex((s) => s.id === changedStepId);

  // All steps before the changed step remain as-is
  for (let i = 0; i < changedIndex; i++) {
    visibleSteps.push(steps[i].id);
  }

  // Re-evaluate from the changed step onward
  for (let i = changedIndex; i < steps.length; i++) {
    const step = steps[i];
    const shouldSkip = step.skipIf?.some(
      (cond) => values[cond.fieldId] === cond.value,
    );

    if (!shouldSkip) {
      visibleSteps.push(step.id);
    }
  }

  return visibleSteps;
}

/**
 * Computes the next visible step given current position and values.
 */
export function getNextStep(
  steps: Step[],
  currentStepId: string,
  values: Record<string, unknown>,
): string | null {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);
  if (currentIndex >= steps.length - 1) return null;

  for (let i = currentIndex + 1; i < steps.length; i++) {
    const step = steps[i];
    const shouldSkip = step.skipIf?.some(
      (cond) => values[cond.fieldId] === cond.value,
    );
    if (!shouldSkip) return step.id;
  }

  return null; // No more visible steps
}

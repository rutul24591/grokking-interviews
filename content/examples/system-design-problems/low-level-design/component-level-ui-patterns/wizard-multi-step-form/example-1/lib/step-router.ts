/**
 * Wizard / Multi-step Form — Step Router
 *
 * Handles conditional step logic. Each step can define a `skipStep` predicate
 * that receives the current field values and returns a boolean. The step router
 * evaluates all predicates and computes the effective step path — an ordered
 * array of step IDs that excludes skipped steps. It also maintains a navigation
 * history stack for accurate back-button behavior.
 */

import type { StepDefinition, FieldValue } from "./wizard-types";

// ---------------------------------------------------------------------------
// Effective Step Path
// ---------------------------------------------------------------------------

/**
 * Evaluate all `skipStep` predicates and return the ordered list of step IDs
 * that should be rendered (i.e., not skipped).
 */
export function computeEffectiveStepPath(
  steps: StepDefinition[],
  fieldValues: Record<string, Record<string, FieldValue>>,
): string[] {
  const effectivePath: string[] = [];

  for (const step of steps) {
    // If the step has a skipStep predicate, evaluate it
    if (step.skipStep) {
      const shouldSkip = step.skipStep(fieldValues);
      if (!shouldSkip) {
        effectivePath.push(step.id);
      }
    } else {
      effectivePath.push(step.id);
    }
  }

  return effectivePath;
}

/**
 * Given the effective path and the current step index in the original steps
 * array, compute the corresponding index in the effective path.
 */
export function mapToEffectiveIndex(
  steps: StepDefinition[],
  effectivePath: string[],
  originalIndex: number,
): number {
  const currentStepId = steps[originalIndex]?.id;
  const effectiveIndex = effectivePath.indexOf(currentStepId);
  return effectiveIndex >= 0 ? effectiveIndex : originalIndex;
}

// ---------------------------------------------------------------------------
// Navigation History
// ---------------------------------------------------------------------------

export interface NavigationHistory {
  /** Stack of step IDs representing the navigation path */
  stack: string[];
  /** Set of completed/visited step IDs */
  completedSteps: Set<string>;
}

/**
 * Push a step onto the navigation history when navigating forward.
 */
export function pushToHistory(
  history: NavigationHistory,
  stepId: string,
): NavigationHistory {
  return {
    stack: [...history.stack, stepId],
    completedSteps: new Set(history.completedSteps).add(stepId),
  };
}

/**
 * Pop the last step from the navigation history when navigating backward.
 */
export function popFromHistory(
  history: NavigationHistory,
): { stepId: string | null; remaining: NavigationHistory } {
  if (history.stack.length === 0) {
    return { stepId: null, remaining: history };
  }

  const stack = history.stack.slice(0, -1);
  return {
    stepId: history.stack[history.stack.length - 1],
    remaining: {
      stack,
      completedSteps: new Set(history.completedSteps),
    },
  };
}

/**
 * Check whether a step is accessible given the current navigation state
 * and the wizard's linear/non-linear mode.
 */
export function canAccessStep(
  stepIndex: number,
  isLinear: boolean,
  visitedSteps: string[],
  effectivePath: string[],
  currentStepIndex: number,
): boolean {
  // Current step is always accessible
  if (stepIndex === currentStepIndex) return true;

  if (!isLinear) {
    // Non-linear mode: all steps are accessible
    return true;
  }

  // Linear mode: only visited steps and the next unvisited step are accessible
  const stepId = effectivePath[stepIndex];
  if (!stepId) return false;

  // Already visited
  if (visitedSteps.includes(stepId)) return true;

  // Next unvisited step (the first unvisited step in the effective path)
  const firstUnvisitedIndex = effectivePath.findIndex(
    (id) => !visitedSteps.includes(id),
  );
  return stepIndex === firstUnvisitedIndex;
}

/**
 * Given a current step ID, find the next accessible step ID in the effective path.
 */
export function getNextStepId(
  currentStepId: string,
  effectivePath: string[],
  visitedSteps: string[],
  isLinear: boolean,
): string | null {
  const currentIndex = effectivePath.indexOf(currentStepId);
  if (currentIndex < 0 || currentIndex >= effectivePath.length - 1) return null;

  const nextId = effectivePath[currentIndex + 1];
  if (!nextId) return null;

  // In linear mode, the next step must be the immediate next in the effective path
  if (isLinear) return nextId;

  // In non-linear mode, still return the next step for the "Next" button
  return nextId;
}

/**
 * Given a current step ID, find the previous accessible step ID in the history.
 */
export function getPreviousStepId(
  history: NavigationHistory,
): string | null {
  if (history.stack.length === 0) return null;
  return history.stack[history.stack.length - 1];
}

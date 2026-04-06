/**
 * Wizard / Multi-step Form — useStepHistory Hook
 *
 * Manages the navigation history stack, tracking completed steps and enabling
 * accurate back-button behavior. Distinguishes between forward navigation
 * (push to history) and backward navigation (pop from history), ensuring
 * the stepper always reflects the correct state.
 */

import { useState, useCallback } from "react";

// ---------------------------------------------------------------------------
// Hook return type
// ---------------------------------------------------------------------------

interface UseStepHistoryReturn {
  /** Stack of step IDs representing the navigation path */
  history: string[];
  /** Set of completed/visited step IDs */
  completedSteps: Set<string>;
  /** Whether the user can go back */
  canGoBack: boolean;
  /** Push current step onto history before navigating forward */
  push: (stepId: string) => void;
  /** Pop the last step from history (for back navigation) */
  pop: () => string | null;
  /** Mark a step as completed */
  markCompleted: (stepId: string) => void;
  /** Check if a step is completed */
  isCompleted: (stepId: string) => boolean;
  /** Reset the history */
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Hook implementation
// ---------------------------------------------------------------------------

export function useStepHistory(
  initialHistory: string[] = [],
  initialCompleted: string[] = [],
): UseStepHistoryReturn {
  const [history, setHistory] = useState<string[]>(initialHistory);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    new Set(initialCompleted),
  );

  const push = useCallback((stepId: string) => {
    setHistory((prev) => [...prev, stepId]);
  }, []);

  const pop = useCallback((): string | null => {
    let popped: string | null = null;
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      popped = prev[prev.length - 1];
      return prev.slice(0, -1);
    });
    return popped;
  }, []);

  const markCompleted = useCallback((stepId: string) => {
    setCompletedSteps((prev) => {
      if (prev.has(stepId)) return prev;
      const next = new Set(prev);
      next.add(stepId);
      return next;
    });
  }, []);

  const isCompleted = useCallback(
    (stepId: string): boolean => {
      return completedSteps.has(stepId);
    },
    [completedSteps],
  );

  const canGoBack = history.length > 0;

  const reset = useCallback(() => {
    setHistory([]);
    setCompletedSteps(new Set());
  }, []);

  return {
    history,
    completedSteps,
    canGoBack,
    push,
    pop,
    markCompleted,
    isCompleted,
    reset,
  };
}

'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import type { Step } from '../lib/stepper-types';

const STORAGE_KEY_PREFIX = 'stepper-state-';

interface UseStepperOptions {
  steps: Step[];
  persistenceKey?: string;
  allowSkip?: boolean;
  allowBack?: boolean;
  onStepChange?: (stepId: string, direction: 'forward' | 'backward' | 'jump') => void;
  onComplete?: () => void;
}

interface UseStepperReturn {
  currentStepIndex: number;
  currentStep: Step;
  completedIds: Set<string>;
  skippedIds: Set<string>;
  progress: number;
  isFirst: boolean;
  isLast: boolean;
  goToStep: (index: number) => boolean;
  nextStep: () => boolean;
  prevStep: () => boolean;
  markComplete: (stepId: string) => void;
  markSkipped: (stepId: string) => void;
  reset: () => void;
  canProceed: (stepId: string) => boolean;
}

/**
 * Main stepper hook with step transitions, validation gating,
 * skip logic, and optional localStorage persistence.
 */
export function useStepper({
  steps,
  persistenceKey,
  allowSkip = false,
  allowBack = true,
  onStepChange,
  onComplete,
}: UseStepperOptions): UseStepperReturn {
  const stepsRef = useRef(steps);
  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  // Load persisted state if available
  const loadPersistedState = useCallback((): { currentStepIndex: number; completedIds: Set<string>; skippedIds: Set<string> } | null => {
    if (!persistenceKey || typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${persistenceKey}`);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return {
        currentStepIndex: parsed.currentStepIndex ?? 0,
        completedIds: new Set(parsed.completedIds ?? []),
        skippedIds: new Set(parsed.skippedIds ?? []),
      };
    } catch {
      return null;
    }
  }, [persistenceKey]);

  const persisted = loadPersistedState();

  const [currentStepIndex, setCurrentStepIndex] = useState(persisted?.currentStepIndex ?? 0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(persisted?.completedIds ?? new Set());
  const [skippedIds, setSkippedIds] = useState<Set<string>>(persisted?.skippedIds ?? new Set());

  // Persist state changes to localStorage
  useEffect(() => {
    if (!persistenceKey || typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}${persistenceKey}`,
        JSON.stringify({
          currentStepIndex,
          completedIds: Array.from(completedIds),
          skippedIds: Array.from(skippedIds),
        })
      );
    } catch {
      // Storage unavailable
    }
  }, [currentStepIndex, completedIds, skippedIds, persistenceKey]);

  const currentStep = steps[currentStepIndex] ?? steps[0];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;
  const progress = Math.round(((completedIds.size + skippedIds.size) / steps.length) * 100);

  /**
   * Check if a step can be proceeded from (validation gate).
   * A step blocks progress if it's not completed, not skipped, and
   * the step's isValid flag is explicitly false.
   */
  const canProceed = useCallback(
    (stepId: string): boolean => {
      const step = steps.find((s) => s.id === stepId);
      if (!step) return true;

      // Completed or skipped steps always allow proceeding
      if (completedIds.has(stepId) || skippedIds.has(stepId)) return true;

      // If skip is allowed, any step can be skipped
      if (allowSkip) return true;

      // Check step's validation state
      if (step.isValid === false) return false;

      // Default: allow if no explicit invalid state
      return true;
    },
    [steps, completedIds, skippedIds, allowSkip]
  );

  /**
   * Navigate to a specific step by index.
   * Returns false if the transition is blocked by validation.
   */
  const goToStep = useCallback(
    (index: number): boolean => {
      const clamped = Math.max(0, Math.min(index, steps.length - 1));
      const targetStep = steps[clamped];

      // Validate intermediate steps when jumping forward
      if (clamped > currentStepIndex) {
        for (let i = currentStepIndex; i < clamped; i++) {
          if (!canProceed(steps[i].id)) return false;
        }
      }

      // Allow backward navigation
      if (clamped < currentStepIndex && !allowBack) return false;

      const direction = clamped > currentStepIndex ? 'forward' : clamped < currentStepIndex ? 'backward' : 'jump';
      setCurrentStepIndex(clamped);
      onStepChange?.(targetStep.id, direction);
      return true;
    },
    [currentStepIndex, steps, canProceed, allowBack, onStepChange]
  );

  const nextStep = useCallback((): boolean => {
    const currentStepId = steps[currentStepIndex]?.id;

    // Mark current step as complete if not already
    if (currentStepId && !completedIds.has(currentStepId) && !skippedIds.has(currentStepId)) {
      setCompletedIds((prev) => new Set(prev).add(currentStepId));
    }

    if (currentStepIndex >= steps.length - 1) {
      onComplete?.();
      return false;
    }

    const nextIdx = currentStepIndex + 1;
    const nextStepId = steps[nextIdx]?.id;

    if (!canProceed(nextStepId) && !allowSkip) return false;

    setCurrentStepIndex(nextIdx);
    onStepChange?.(nextStepId, 'forward');
    return true;
  }, [currentStepIndex, steps, completedIds, skippedIds, canProceed, allowSkip, onStepChange, onComplete]);

  const prevStep = useCallback((): boolean => {
    if (!allowBack || currentStepIndex <= 0) return false;
    const prevIdx = currentStepIndex - 1;
    const prevStepId = steps[prevIdx]?.id;
    setCurrentStepIndex(prevIdx);
    onStepChange?.(prevStepId, 'backward');
    return true;
  }, [currentStepIndex, steps, allowBack, onStepChange]);

  const markComplete = useCallback(
    (stepId: string) => {
      setCompletedIds((prev) => {
        const next = new Set(prev).add(stepId);
        // Remove from skipped if it was there
        return next;
      });
      setSkippedIds((prev) => {
        const next = new Set(prev);
        next.delete(stepId);
        return next;
      });
    },
    []
  );

  const markSkipped = useCallback(
    (stepId: string) => {
      if (!allowSkip) return;
      setSkippedIds((prev) => new Set(prev).add(stepId));
    },
    [allowSkip]
  );

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setCompletedIds(new Set());
    setSkippedIds(new Set());
    if (persistenceKey && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${persistenceKey}`);
      } catch {
        // Ignore
      }
    }
    onStepChange?.(steps[0]?.id, 'jump');
  }, [persistenceKey, steps, onStepChange]);

  return {
    currentStepIndex,
    currentStep,
    completedIds,
    skippedIds,
    progress,
    isFirst,
    isLast,
    goToStep,
    nextStep,
    prevStep,
    markComplete,
    markSkipped,
    reset,
    canProceed,
  };
}

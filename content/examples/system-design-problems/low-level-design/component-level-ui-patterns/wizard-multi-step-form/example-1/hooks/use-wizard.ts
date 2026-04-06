/**
 * Wizard / Multi-step Form — useWizard Hook
 *
 * Main orchestrator hook wrapping the Zustand store. Exposes navigation
 * methods (next, previous, goToStep), validation triggers, draft save/restore,
 * and submit. Handles the lifecycle: on mount, attempt draft restore; on
 * unmount, auto-save; on step change, run conditional step recalculation.
 */

import { useEffect, useCallback, useRef } from "react";
import type { StepDefinition, FieldValue, WizardSubmitPayload, WizardConfig } from "../lib/wizard-types";
import { createWizardStore } from "../lib/wizard-store";
import { validateStepSync } from "../lib/validation-gate";
import { computeEffectiveStepPath } from "../lib/step-router";

// ---------------------------------------------------------------------------
// Hook return type
// ---------------------------------------------------------------------------

interface UseWizardReturn {
  /** Current step index */
  currentStepIndex: number;
  /** Current step definition */
  currentStep: StepDefinition | undefined;
  /** Total number of steps (original, not effective) */
  totalSteps: number;
  /** Effective step path (excludes skipped steps) */
  effectivePath: string[];
  /** Field values for the current step */
  fieldValues: Record<string, FieldValue>;
  /** All field values across all steps */
  allFieldValues: Record<string, Record<string, FieldValue>>;
  /** Validation result for the current step */
  validationResult: { isValid: boolean; errors: Record<string, string>; asyncStatus: string } | undefined;
  /** Whether the current step is valid */
  isCurrentStepValid: boolean;
  /** Set of visited/completed step IDs */
  visitedSteps: string[];
  /** Whether the wizard is in linear mode */
  isLinear: boolean;
  /** Whether the wizard has been submitted */
  isSubmitted: boolean;
  /** Whether a draft was found on mount */
  hasDraft: boolean;
  /** Whether a draft is currently being restored */
  isRestoring: boolean;
  /** Navigation: advance to next step (validates first) */
  next: () => boolean;
  /** Navigation: go to previous step (no validation) */
  previous: () => void;
  /** Navigation: jump to a specific step index */
  goToStep: (index: number) => void;
  /** Set a field value */
  setFieldValue: (fieldName: string, value: FieldValue) => void;
  /** Run validation on the current step */
  validateCurrentStep: () => { isValid: boolean; errors: Record<string, string> };
  /** Restore a saved draft */
  restoreDraft: () => boolean;
  /** Clear the saved draft */
  clearDraft: () => void;
  /** Submit the wizard */
  submit: () => WizardSubmitPayload | null;
  /** Whether the Next button should be disabled */
  isNextDisabled: boolean;
  /** Whether this is the last step */
  isLastStep: boolean;
  /** Whether this is the first step */
  isFirstStep: boolean;
}

// ---------------------------------------------------------------------------
// Hook implementation
// ---------------------------------------------------------------------------

// Store singleton — one store instance per unique draftKey
const storeCache = new Map<string, ReturnType<typeof createWizardStore>>();

export function useWizard(config: WizardConfig): UseWizardReturn {
  const {
    steps,
    onSubmit,
    linear = true,
    draftKey = "default",
    autoSaveInterval = 2000,
  } = config;

  // Get or create store from cache
  const cacheKey = draftKey;
  if (!storeCache.has(cacheKey)) {
    storeCache.set(cacheKey, createWizardStore(steps, draftKey, linear));
  }
  const useStore = storeCache.get(cacheKey)!;

  // Subscribe to store state
  const currentStepIndex = useStore((s) => s.currentStepIndex);
  const allFieldValues = useStore((s) => s.fieldValues);
  const validationResults = useStore((s) => s.validationResults);
  const visitedSteps = useStore((s) => s.visitedSteps);
  const isLinear = useStore((s) => s.isLinear);
  const isSubmitted = useStore((s) => s.isSubmitted);
  const hasDraft = useStore((s) => s.hasDraft);
  const isRestoring = useStore((s) => s.isRestoring);
  const history = useStore((s) => s.history);

  // Derived state
  const currentStep = steps[currentStepIndex];
  const fieldValues = allFieldValues[currentStep?.id ?? ""] ?? {};
  const validationResult = currentStep
    ? validationResults[currentStep.id]
    : undefined;
  const isCurrentStepValid = validationResult?.isValid ?? false;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  // Compute effective step path
  const effectivePath = computeEffectiveStepPath(steps, allFieldValues);

  // Auto-save interval
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const store = useStore.getState();
    autoSaveRef.current = setInterval(() => {
      store.saveDraft();
    }, autoSaveInterval);

    return () => {
      if (autoSaveRef.current !== null) {
        clearInterval(autoSaveRef.current);
      }
      // Final save on unmount
      useStore.getState().saveDraft();
    };
  }, [useStore, autoSaveInterval]);

  // Navigation: next (with validation gate)
  const next = useCallback((): boolean => {
    const store = useStore.getState();
    const step = steps[currentStepIndex];
    if (!step) return false;

    // Run sync validation
    const result = validateStepSync(step.fields, store.fieldValues[step.id] ?? {});
    store.setStepValidation(step.id, result);

    if (!result.isValid) {
      return false;
    }

    // Mark as visited and advance
    store.markVisited(step.id);
    store.next();
    return true;
  }, [useStore, steps, currentStepIndex]);

  // Navigation: previous
  const previous = useCallback(() => {
    useStore.getState().previous();
  }, [useStore]);

  // Navigation: go to specific step
  const goToStep = useCallback(
    (index: number) => {
      useStore.getState().goToStep(index);
    },
    [useStore],
  );

  // Set field value
  const setFieldValue = useCallback(
    (fieldName: string, value: FieldValue) => {
      const step = steps[currentStepIndex];
      if (!step) return;
      useStore.getState().setFieldValue(step.id, fieldName, value);
    },
    [useStore, steps, currentStepIndex],
  );

  // Validate current step (without advancing)
  const validateCurrentStep = useCallback(() => {
    const store = useStore.getState();
    const step = steps[currentStepIndex];
    if (!step) return { isValid: false, errors: {} };

    const result = validateStepSync(step.fields, store.fieldValues[step.id] ?? {});
    store.setStepValidation(step.id, result);
    return { isValid: result.isValid, errors: result.errors };
  }, [useStore, steps, currentStepIndex]);

  // Restore draft
  const restoreDraft = useCallback(() => {
    return useStore.getState().restoreDraft();
  }, [useStore]);

  // Clear draft
  const clearDraft = useCallback(() => {
    useStore.getState().clearDraft();
  }, [useStore]);

  // Submit
  const submit = useCallback((): WizardSubmitPayload | null => {
    const payload = useStore.getState().submit();
    if (payload) {
      void Promise.resolve(onSubmit(payload));
    }
    return payload;
  }, [useStore, onSubmit]);

  // Determine if Next button should be disabled
  // It is disabled when we are on the last step (use Submit instead)
  // or when validation has been attempted and failed
  const isNextDisabled = isLastStep || (!isCurrentStepValid && Object.keys(validationResult?.errors ?? {}).length > 0);

  return {
    currentStepIndex,
    currentStep,
    totalSteps: steps.length,
    effectivePath,
    fieldValues,
    allFieldValues,
    validationResult,
    isCurrentStepValid,
    visitedSteps,
    isLinear,
    isSubmitted,
    hasDraft,
    isRestoring,
    next,
    previous,
    goToStep,
    setFieldValue,
    validateCurrentStep,
    restoreDraft,
    clearDraft,
    submit,
    isNextDisabled,
    isLastStep,
    isFirstStep,
  };
}

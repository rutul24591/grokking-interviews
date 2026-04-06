// useForm hook — provides form-level state and actions.
// Subscribes to the store for form-wide state (current step, submission state, validity).

import { useCallback } from "react";
import { useFormStore } from "../lib/form-store";
import type { FormSubmitPayload } from "../lib/form-types";

/** Return type of the useForm hook. */
interface UseFormReturn {
  /** Current step index (0-based). */
  currentStep: number;
  /** Total number of steps. */
  totalSteps: number;
  /** Map of step ID to validity status. */
  stepValidity: Record<string, boolean>;
  /** Steps configuration. */
  steps: Array<{ id: string; title: string; description?: string }>;
  /** Whether the entire form is valid. */
  isValid: boolean;
  /** All field values as a flat object. */
  values: Record<string, unknown>;
  /** Current submission state. */
  submissionState: "idle" | "submitting" | "submitted" | "error";
  /** Submission error message. */
  submissionError: string | null;
  /** Field errors map. */
  errors: Record<string, string | null>;
  /** Whether a draft exists. */
  hasDraft: boolean;
  /** Navigate to the next step (validates current step first). */
  nextStep: () => boolean;
  /** Navigate to the previous step (no validation). */
  previousStep: () => void;
  /** Navigate directly to a step (validates preceding steps). */
  goToStep: (index: number) => boolean;
  /** Submit the form (runs full validation, then calls onSubmit). */
  submitForm: () => Promise<boolean>;
  /** Manually save a draft to localStorage. */
  saveDraft: () => void;
  /** Restore the saved draft from localStorage. */
  restoreDraft: () => boolean;
  /** Reset the form to initial state. */
  resetForm: () => void;
}

/**
 * Hook for form-level state and actions.
 * Provides step navigation, submission, draft management,
 * and form-wide validity status.
 */
export function useForm(): UseFormReturn {
  // Subscribe to form-wide state
  const currentStep = useFormStore((state) => state.currentStep);
  const steps = useFormStore((state) => state.steps);
  const stepValidity = useFormStore((state) => state.stepValidity);
  const isValid = useFormStore((state) => state.isValid);
  const errors = useFormStore((state) => state.errors);
  const submissionState = useFormStore((state) => state.submissionState);
  const submissionError = useFormStore((state) => state.submissionError);
  const hasDraft = useFormStore((state) => state.hasDraft);
  const fields = useFormStore((state) => state.fields);

  // Compute values from fields
  const values = Object.fromEntries(
    Object.entries(fields).map(([name, field]) => [name, field.value])
  );

  const nextStep = useCallback(() => {
    return useFormStore.getState().nextStep();
  }, []);

  const previousStep = useCallback(() => {
    useFormStore.getState().previousStep();
  }, []);

  const goToStep = useCallback((index: number) => {
    return useFormStore.getState().goToStep(index);
  }, []);

  const submitForm = useCallback(async (): Promise<boolean> => {
    // In a real implementation, the onSubmit callback would be passed via context
    // or as a parameter to useForm
    return useFormStore.getState().submitForm(undefined);
  }, []);

  const saveDraft = useCallback(() => {
    useFormStore.getState().saveDraft();
  }, []);

  const restoreDraft = useCallback(() => {
    return useFormStore.getState().restoreDraft();
  }, []);

  const resetForm = useCallback(() => {
    useFormStore.getState().resetForm();
  }, []);

  return {
    currentStep,
    totalSteps: steps.length,
    stepValidity,
    steps: steps.map((s) => ({ id: s.id, title: s.title, description: s.description })),
    isValid,
    values,
    submissionState,
    submissionError,
    errors,
    hasDraft,
    nextStep,
    previousStep,
    goToStep,
    submitForm,
    saveDraft,
    restoreDraft,
    resetForm,
  };
}

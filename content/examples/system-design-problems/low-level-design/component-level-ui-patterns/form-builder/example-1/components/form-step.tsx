// FormStep — step wrapper with validation gate.
// Renders navigation buttons (Next/Previous) and validates before advancing.

"use client";

import { useCallback } from "react";
import { useFormStore } from "../lib/form-store";
import { useForm } from "../hooks/use-form";

interface FormStepProps {
  /** Step ID for multi-step forms. Undefined for single-step. */
  stepId?: string;
  /** Whether this is the last step (shows Submit instead of Next). */
  isLastStep: boolean;
  /** Whether the form is currently submitting. */
  isSubmitting: boolean;
}

export function FormStep({ stepId, isLastStep, isSubmitting }: FormStepProps) {
  const { currentStep, totalSteps, previousStep, nextStep } = useForm();
  const pendingAsyncValidations = useFormStore(
    (state) => state.pendingAsyncValidations
  );

  const hasPendingAsync = pendingAsyncValidations.size > 0;

  const handleNext = useCallback(() => {
    if (hasPendingAsync) return;
    if (!isLastStep) {
      const advanced = nextStep();
      if (!advanced) {
        // Validation failed — scroll to first error
        const firstErrorField = document.querySelector('[role="alert"]');
        firstErrorField?.scrollIntoView({ behavior: "smooth", block: "center" });
        const input = firstErrorField?.previousElementSibling?.querySelector("input, select, textarea");
        (input as HTMLElement)?.focus();
      }
    }
  }, [nextStep, isLastStep, hasPendingAsync]);

  const handlePrevious = useCallback(() => {
    previousStep();
  }, [previousStep]);

  // Single-step form: only show submit button
  if (!stepId) {
    return (
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting || hasPendingAsync}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    );
  }

  // Multi-step form: show Previous/Next/Submit
  return (
    <div className="flex items-center justify-between pt-4">
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentStep === 0}
        className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      {isLastStep ? (
        <button
          type="submit"
          disabled={isSubmitting || hasPendingAsync}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          disabled={hasPendingAsync}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      )}
    </div>
  );
}

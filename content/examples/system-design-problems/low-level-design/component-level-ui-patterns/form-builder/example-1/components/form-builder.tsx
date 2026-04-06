// FormBuilder — root component that renders a form from a JSON schema.
// Initializes the store, renders stepper (if multi-step), and handles submission.

"use client";

import { useEffect, useCallback } from "react";
import { useFormStore } from "../lib/form-store";
import type {
  FormBuilderConfig,
  FormSubmitPayload,
} from "../lib/form-types";
import { FormStep } from "./form-step";
import { FormStepper } from "./form-stepper";
import { FormField } from "./form-field";

interface FormBuilderProps extends FormBuilderConfig {}

export function FormBuilder({
  formId,
  fields,
  steps,
  onSubmit,
  enableDrafts = true,
  promptDraftRestore = true,
}: FormBuilderProps) {
  // Initialize the store with the schema on mount
  useEffect(() => {
    useFormStore.getState().initialize({
      formId,
      fields,
      steps,
      onSubmit,
      enableDrafts,
      promptDraftRestore,
    });
  }, [formId, fields, steps, onSubmit, enableDrafts, promptDraftRestore]);

  // Handle form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      useFormStore.getState().submitForm(onSubmit);
    },
    [onSubmit]
  );

  // Get current step's fields
  const isMultiStep = (steps?.length ?? 0) > 0;
  const currentStepIndex = useFormStore((state) => state.currentStep);
  const hasDraft = useFormStore((state) => state.hasDraft);
  const submissionState = useFormStore((state) => state.submissionState);

  // Determine which fields to render
  const visibleFields = isMultiStep
    ? steps?.[currentStepIndex]?.fieldNames ?? fields.map((f) => f.name)
    : fields.map((f) => f.name);

  const fieldMap = Object.fromEntries(fields.map((f) => [f.name, f]));

  // Draft restore prompt
  if (hasDraft && promptDraftRestore) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">Draft Found</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          You have an unsaved draft from a previous session. Would you like to
          restore it or start fresh?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => useFormStore.getState().restoreDraft()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
          >
            Restore Draft
          </button>
          <button
            type="button"
            onClick={() => useFormStore.getState().clearDraft()}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Start Fresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Multi-step stepper */}
      {isMultiStep && steps && (
        <FormStepper
          steps={steps.map((s) => ({ id: s.id, title: s.title }))}
          currentStep={currentStepIndex}
        />
      )}

      {/* Submission error banner */}
      {submissionState === "error" && (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950"
        >
          <p className="text-sm text-red-700 dark:text-red-300">
            Please fix the errors before submitting.
          </p>
        </div>
      )}

      {/* Success state */}
      {submissionState === "submitted" && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-950">
          <p className="text-sm text-green-700 dark:text-green-300">
            Form submitted successfully!
          </p>
        </div>
      )}

      {/* Render fields for the current step (or all fields if single-step) */}
      <div className="space-y-4">
        {visibleFields.map((fieldName) => {
          const definition = fieldMap[fieldName];
          if (!definition) return null;
          return <FormField key={fieldName} definition={definition} />;
        })}
      </div>

      {/* Step navigation or submit button */}
      <FormStep
        stepId={isMultiStep ? steps?.[currentStepIndex]?.id : undefined}
        isLastStep={!isMultiStep || currentStepIndex === (steps?.length ?? 1) - 1}
        isSubmitting={submissionState === "submitting"}
      />

      {/* Draft save indicator */}
      {enableDrafts && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Auto-saving enabled</span>
          <button
            type="button"
            onClick={() => useFormStore.getState().saveDraft()}
            className="text-accent hover:underline"
          >
            Save Draft Now
          </button>
        </div>
      )}
    </form>
  );
}

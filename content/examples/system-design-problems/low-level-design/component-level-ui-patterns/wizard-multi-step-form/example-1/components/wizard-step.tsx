/**
 * Wizard / Multi-step Form — Step Component
 *
 * Renders an individual step with field rendering, validation errors,
 * and Next/Previous/Submit navigation buttons. Manages focus on mount
 * and coordinates with the validation hook.
 */

"use client";

import { useEffect, useRef, useCallback } from "react";
import type {
  StepDefinition,
  FieldValue,
  StepValidationResult,
} from "../../lib/wizard-types";
import { useStepValidation } from "../../hooks/use-step-validation";
import { WizardFieldRenderer } from "./wizard-field-renderer";

interface WizardStepProps {
  /** Step definition */
  step: StepDefinition;
  /** Current field values for this step */
  fieldValues: Record<string, FieldValue>;
  /** Validation result for this step */
  validationResult: StepValidationResult | undefined;
  /** Callback when a field value changes */
  onFieldChange: (fieldName: string, value: FieldValue) => void;
  /** Callback for Next button */
  onNext: () => void;
  /** Callback for Previous button */
  onPrevious: () => void;
  /** Label for the Next button */
  nextLabel: string;
  /** Label for the Previous button */
  prevLabel: string;
  /** Whether the Next button should be disabled */
  isNextDisabled: boolean;
  /** Whether this is the first step */
  isFirstStep: boolean;
  /** Whether this is the last step */
  isLastStep: boolean;
}

export function WizardStep({
  step,
  fieldValues,
  validationResult,
  onFieldChange,
  onNext,
  onPrevious,
  nextLabel,
  prevLabel,
  isNextDisabled,
  isFirstStep,
  isLastStep,
}: WizardStepProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstErrorRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  const {
    getFieldError,
    touchField,
    submitAttempted,
    markSubmitAttempted,
  } = useStepValidation(step.fields, fieldValues);

  // Focus management on mount
  useEffect(() => {
    // Focus the step heading when the step becomes active
    headingRef.current?.focus();
  }, []);

  // Focus first error field when validation fails
  useEffect(() => {
    if (validationResult && !validationResult.isValid && submitAttempted) {
      const firstErrorField = Object.keys(validationResult.errors)[0];
      if (firstErrorField && firstErrorRef.current) {
        firstErrorRef.current.focus();
      }
    }
  }, [validationResult, submitAttempted]);

  const handleNext = useCallback(() => {
    markSubmitAttempted();
    onNext();
  }, [markSubmitAttempted, onNext]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        // Don't submit on Enter for textarea fields
        if (e.target instanceof HTMLTextAreaElement) return;
        e.preventDefault();
        handleNext();
      }
    },
    [handleNext],
  );

  return (
    <div
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      onKeyDown={handleKeyDown}
    >
      {/* Step heading */}
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mb-1 text-xl font-semibold text-gray-900 outline-none focus:text-blue-600 dark:text-gray-100 dark:focus:text-blue-400"
      >
        {step.title}
      </h2>
      {step.description && (
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {step.description}
        </p>
      )}

      {/* Fields */}
      <div className="space-y-5">
        {step.fields.map((field, fieldIndex) => {
          const error = getFieldError(field.name);
          const isFirstError =
            submitAttempted &&
            validationResult !== undefined &&
            Object.keys(validationResult.errors)[0] === field.name;

          return (
            <div key={field.name}>
              <WizardFieldRenderer
                field={field}
                value={fieldValues[field.name] ?? ""}
                error={error}
                onChange={(value: FieldValue) => onFieldChange(field.name, value)}
                onBlur={() => touchField(field.name)}
                ref={isFirstError ? firstErrorRef : undefined}
              />
            </div>
          );
        })}
      </div>

      {/* Validation summary */}
      {submitAttempted &&
        validationResult &&
        !validationResult.isValid &&
        Object.keys(validationResult.errors).length > 0 && (
          <div
            role="alert"
            aria-live="assertive"
            className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20"
          >
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Please fix {Object.keys(validationResult.errors).length} error
              {Object.keys(validationResult.errors).length > 1 ? "s" : ""} on this
              step.
            </p>
          </div>
        )}

      {/* Navigation buttons */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstStep}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isFirstStep
              ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          {prevLabel}
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`rounded-md px-6 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isNextDisabled
              ? "cursor-not-allowed bg-gray-400 dark:bg-gray-600"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          }`}
        >
          {isLastStep ? nextLabel : nextLabel}
        </button>
      </div>
    </div>
  );
}

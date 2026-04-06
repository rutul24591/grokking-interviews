/**
 * Wizard / Multi-step Form — useStepValidation Hook
 *
 * Per-field validation hook that debounces input (default 300ms), runs sync
 * validators on change, and displays errors on blur or after the first submit
 * attempt. Tracks a `touched` flag per field to avoid showing errors for
 * fields the user hasn't interacted with yet.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import type { FieldDefinition, FieldValue, StepValidationResult } from "../lib/wizard-types";
import { validateStepSync } from "../lib/validation-gate";

// ---------------------------------------------------------------------------
// Hook return type
// ---------------------------------------------------------------------------

interface UseStepValidationReturn {
  /** Current validation result for the step */
  validationResult: StepValidationResult;
  /** Set of field names that have been touched (blurred) */
  touchedFields: Set<string>;
  /** Whether a submit attempt has been made on this step */
  submitAttempted: boolean;
  /**
   * Get the error message for a specific field.
   * Returns undefined if no error should be shown (either no error or field
   * hasn't been touched/submit attempted yet).
   */
  getFieldError: (fieldName: string) => string | undefined;
  /** Mark a field as touched (call onBlur) */
  touchField: (fieldName: string) => void;
  /** Run validation on the current field values */
  runValidation: () => StepValidationResult;
  /** Reset the submit attempted flag */
  resetSubmitAttempted: () => void;
  /** Mark submit attempt */
  markSubmitAttempted: () => void;
}

// ---------------------------------------------------------------------------
// Hook implementation
// ---------------------------------------------------------------------------

export function useStepValidation(
  fields: FieldDefinition[],
  fieldValues: Record<string, FieldValue>,
  debounceMs: number = 300,
): UseStepValidationReturn {
  const [validationResult, setValidationResult] = useState<StepValidationResult>({
    isValid: true,
    errors: {},
    asyncStatus: "idle",
  });

  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Run sync validation with debounce
  const runValidation = useCallback((): StepValidationResult => {
    const result = validateStepSync(fields, fieldValues);
    setValidationResult(result);
    return result;
  }, [fields, fieldValues]);

  // Debounced validation — called on field value change
  useEffect(() => {
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      runValidation();
      debounceTimerRef.current = null;
    }, debounceMs);
  }, [fieldValues, runValidation, debounceMs]);

  // Get error for a field (only show if touched or submit attempted)
  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      if (!touchedFields.has(fieldName) && !submitAttempted) {
        return undefined;
      }
      return validationResult.errors[fieldName];
    },
    [touchedFields, submitAttempted, validationResult.errors],
  );

  // Mark a field as touched
  const touchField = useCallback((fieldName: string) => {
    setTouchedFields((prev) => {
      const next = new Set(prev);
      next.add(fieldName);
      return next;
    });
  }, []);

  const resetSubmitAttempted = useCallback(() => {
    setSubmitAttempted(false);
  }, []);

  const markSubmitAttempted = useCallback(() => {
    setSubmitAttempted(true);
  }, []);

  return {
    validationResult,
    touchedFields,
    submitAttempted,
    getFieldError,
    touchField,
    runValidation,
    resetSubmitAttempted,
    markSubmitAttempted,
  };
}

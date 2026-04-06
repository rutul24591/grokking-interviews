'use client';
import { useState, useCallback, useRef, useEffect } from 'react';

type ValidationResult = { valid: boolean; message?: string };
type SyncValidator<T> = (value: T) => ValidationResult;
type AsyncValidator<T> = (value: T) => Promise<ValidationResult>;
type Validator<T> = SyncValidator<T> | AsyncValidator<T>;

interface StepValidatorConfig<T> {
  stepId: string;
  validators: Validator<T>[];
}

interface UseStepperValidationOptions<T> {
  steps: StepValidatorConfig<T>[];
  onError?: (stepId: string, message: string) => void;
}

interface StepValidationState {
  isValidating: boolean;
  isValid: boolean;
  errors: string[];
}

interface UseStepperValidationReturn<T> {
  validationStates: Record<string, StepValidationState>;
  validateStep: (stepId: string, value: T) => Promise<boolean>;
  validateAll: (values: Record<string, T>) => Promise<boolean>;
  isStepValid: (stepId: string) => boolean;
  isStepValidating: (stepId: string) => boolean;
  getErrors: (stepId: string) => string[];
  resetStep: (stepId: string) => void;
}

function isAsyncValidator<T>(validator: Validator<T>): validator is AsyncValidator<T> {
  return validator.length === 1 && validator.constructor.name === 'AsyncFunction';
}

export function useStepperValidation<T>({
  steps,
  onError,
}: UseStepperValidationOptions<T>): UseStepperValidationReturn<T> {
  const [validationStates, setValidationStates] = useState<Record<string, StepValidationState>>(() => {
    const initial: Record<string, StepValidationState> = {};
    for (const step of steps) {
      initial[step.stepId] = { isValidating: false, isValid: false, errors: [] };
    }
    return initial;
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const validateStep = useCallback(
    async (stepId: string, value: T): Promise<boolean> => {
      const stepConfig = steps.find((s) => s.stepId === stepId);
      if (!stepConfig) return true;

      // Set validating state
      setValidationStates((prev) => ({
        ...prev,
        [stepId]: { isValidating: true, isValid: false, errors: [] },
      }));

      const errors: string[] = [];
      let allValid = true;

      for (const validator of stepConfig.validators) {
        try {
          const result: ValidationResult = await validator(value);
          if (!result.valid) {
            allValid = false;
            if (result.message) errors.push(result.message);
          }
        } catch (err) {
          allValid = false;
          errors.push(err instanceof Error ? err.message : 'Validation failed');
        }
      }

      if (!mountedRef.current) return allValid;

      setValidationStates((prev) => ({
        ...prev,
        [stepId]: { isValidating: false, isValid: allValid, errors },
      }));

      if (!allValid && errors.length > 0) {
        onError?.(stepId, errors[0]);
      }

      return allValid;
    },
    [steps, onError]
  );

  const validateAll = useCallback(
    async (values: Record<string, T>): Promise<boolean> => {
      let allValid = true;
      for (const step of steps) {
        const value = values[step.stepId];
        if (value === undefined) continue;
        const valid = await validateStep(step.stepId, value);
        if (!valid) allValid = false;
      }
      return allValid;
    },
    [steps, validateStep]
  );

  const isStepValid = useCallback(
    (stepId: string) => validationStates[stepId]?.isValid ?? false,
    [validationStates]
  );

  const isStepValidating = useCallback(
    (stepId: string) => validationStates[stepId]?.isValidating ?? false,
    [validationStates]
  );

  const getErrors = useCallback(
    (stepId: string) => validationStates[stepId]?.errors ?? [],
    [validationStates]
  );

  const resetStep = useCallback((stepId: string) => {
    setValidationStates((prev) => ({
      ...prev,
      [stepId]: { isValidating: false, isValid: false, errors: [] },
    }));
  }, []);

  return {
    validationStates,
    validateStep,
    validateAll,
    isStepValid,
    isStepValidating,
    getErrors,
    resetStep,
  };
}

// Pre-built common validators
export const validators = {
  required: (fieldLabel = 'This field'): SyncValidator<string> => (value: string) => {
    if (!value || !String(value).trim()) return { valid: false, message: `${fieldLabel} is required` };
    return { valid: true };
  },

  minLength: (min: number): SyncValidator<string> => (value: string) => {
    if (String(value).length < min) return { valid: false, message: `Minimum ${min} characters required` };
    return { valid: true };
  },

  maxLength: (max: number): SyncValidator<string> => (value: string) => {
    if (String(value).length > max) return { valid: false, message: `Maximum ${max} characters allowed` };
    return { valid: true };
  },

  email: (): SyncValidator<string> => (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return { valid: false, message: 'Invalid email address' };
    return { valid: true };
  },

  pattern: (regex: RegExp, message: string): SyncValidator<string> => (value: string) => {
    if (!regex.test(value)) return { valid: false, message };
    return { valid: true };
  },

  // Async: check if value already exists
  unique: (checkFn: (value: string) => Promise<boolean>, message = 'Value already exists'): AsyncValidator<string> => {
    return async (value: string) => {
      const exists = await checkFn(value);
      return exists ? { valid: false, message } : { valid: true };
    };
  },
};

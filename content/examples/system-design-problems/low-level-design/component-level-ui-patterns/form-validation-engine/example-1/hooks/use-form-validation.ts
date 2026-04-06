"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import type {
  ValidationConfig,
  FieldErrors,
  ValidationResult,
  ValidationError,
  UseFormValidationReturn,
} from "../lib/validation-types";
import { ValidationEngine } from "../lib/validation-engine";

/**
 * Form-level validation hook.
 * Aggregates validity across all fields, manages touch tracking,
 * and gates form submission until all validators resolve.
 */
export function useFormValidation(
  config: ValidationConfig
): UseFormValidationReturn {
  const engineRef = useRef<ValidationEngine | null>(null);

  if (!engineRef.current) {
    engineRef.current = new ValidationEngine(config);
  }

  const engine = engineRef.current;

  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    for (const field of config.fields) {
      initial[field.name] = "";
    }
    return initial;
  });

  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isValid, setIsValid] = useState(true);
  const [errorCount, setErrorCount] = useState(0);

  const pendingAsyncRef = useRef(0);

  const setValue = useCallback(
    (fieldName: string, value: unknown) => {
      const newValues = { ...values, [fieldName]: value };
      setValues(newValues);

      // Clear cache for this field when value changes
      engine.clearCache();

      // Check if this field should be validated based on mode
      if (engine.shouldValidate(fieldName, "change")) {
        const syncErrors = engine.validateFieldSync(
          fieldName,
          value,
          newValues
        );
        const dictionary =
          config.i18n?.[config.locale || "en"];
        const interpolatedErrors = syncErrors.map((err) => ({
          ...err,
          message: undefined,
        }));

        setErrors((prev) => {
          const newErrors = { ...prev };
          if (interpolatedErrors.length > 0) {
            newErrors[fieldName] = interpolatedErrors;
          } else {
            delete newErrors[fieldName];
          }
          return newErrors;
        });

        // Trigger cascade revalidation for dependent fields
        const dependents = engine.getDependentFields(fieldName);
        if (dependents.length > 0) {
          // Revalidate dependent fields in the next microtask to batch updates
          queueMicrotask(() => {
            for (const depField of dependents) {
              const depValue = newValues[depField];
              const depErrors = engine.validateFieldSync(
                depField,
                depValue,
                newValues
              );
              setErrors((prev) => {
                const next = { ...prev };
                if (depErrors.length > 0) {
                  next[depField] = depErrors;
                } else {
                  delete next[depField];
                }
                return next;
              });
            }
          });
        }
      }

      // Mark field as touched
      setTouched((prev) => new Set(prev).add(fieldName));
    },
    [values, engine, config]
  );

  const handleSubmit = useCallback(
    (onSubmit: (values: Record<string, unknown>) => void) => {
      // Validate all fields on submit
      const result: ValidationResult = engine.validateAll(values);

      setErrors(result.fieldErrors);
      setIsValid(result.valid);
      setErrorCount(result.errorCount);

      // Mark all fields as touched
      const allTouched = new Set<string>();
      for (const field of config.fields) {
        allTouched.add(field.name);
      }
      setTouched(allTouched);

      // Block submission if invalid
      if (!result.valid) {
        return;
      }

      // If valid, call the submit callback
      onSubmit(values);
    },
    [values, engine, config]
  );

  const reset = useCallback(() => {
    const initial: Record<string, unknown> = {};
    for (const field of config.fields) {
      initial[field.name] = "";
    }
    setValues(initial);
    setTouched(new Set());
    setErrors({});
    setIsValid(true);
    setErrorCount(0);
    pendingAsyncRef.current = 0;
    engine.clearCache();
  }, [config, engine]);

  // Cleanup on unmount
  useMemo(() => {
    return () => {
      engine.cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    values,
    errors,
    isValid,
    errorCount,
    touched,
    setValue,
    handleSubmit,
    reset,
  };
}
